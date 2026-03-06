import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs/promises";
import {
  buildResearchPrompt,
  buildSalaryReportPrompt,
} from "@/lib/reportPrompt";
import { formatCurrencyRange } from "@/lib/currency";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
const allowedMimeTypes = new Set([
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  return uploadResult.file;
}

async function waitForFilesActive(files) {
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      file = await fileManager.getFile(name);
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
}

function parseModelJson(text) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function extractSources(response) {
  try {
    const metadata = response.candidates?.[0]?.groundingMetadata;
    if (!metadata?.groundingChunks) return [];

    const seen = new Set();
    return metadata.groundingChunks
      .filter((c) => c.web?.uri)
      .reduce((acc, c) => {
        if (!seen.has(c.web.uri)) {
          seen.add(c.web.uri);
          acc.push({ title: c.web.title || c.web.uri, url: c.web.uri });
        }
        return acc;
      }, []);
  } catch {
    return [];
  }
}

function buildFallbackReport({
  role,
  city,
  yearsExperience,
  currentSalary,
  targetSalary,
  currency,
}) {
  const experience = Math.max(toNumber(yearsExperience, 3), 0);
  const current = toNumber(currentSalary, 90000);
  const desired = toNumber(targetSalary, current * 1.15);
  const min = Math.round(Math.max(current * 0.95, desired * 0.85));
  const max = Math.round(Math.max(min * 1.2, current * 1.2));
  const roleLabel = role || "your profile";
  const locationLabel = city || "your target market";

  return {
    quickEstimate: {
      headline: "Estimated market-worth range",
      summary: `Based on the details provided for ${roleLabel} in ${locationLabel}, this profile looks competitive around the mid-market range for roughly ${experience} years of experience. Note: this estimate was generated without real-time market research and should be verified against current salary data.`,
      confidenceLabel: "Low",
      marketPosition: current > max ? "Above market" : "Near market",
      salaryRange: { min, max, currency: currency || "USD" },
    },
    factors: [
      "Role and location are the strongest drivers of the estimate.",
      "Experience level shifts both the floor and the upside ceiling.",
      "Current salary and target salary help frame negotiation room.",
    ],
    growthRoles: [
      {
        title: role ? `Senior ${role}` : "Senior specialist role",
        salaryRange: formatCurrencyRange(
          Math.round(min * 1.1),
          Math.round(max * 1.15),
          currency || "USD",
          { currencyDisplay: "code" }
        ),
        reason: "A more senior version of your path may unlock higher compensation.",
      },
      {
        title: "Strategic cross-functional role",
        salaryRange: formatCurrencyRange(
          Math.round(min * 1.05),
          Math.round(max * 1.1),
          currency || "USD",
          { currencyDisplay: "code" }
        ),
        reason: "Broader business ownership can create additional earnings upside.",
      },
      {
        title: "Specialized high-impact role",
        salaryRange: formatCurrencyRange(
          Math.round(min * 1.12),
          Math.round(max * 1.2),
          currency || "USD",
          { currencyDisplay: "code" }
        ),
        reason: "Specialization can improve positioning for better-paying opportunities.",
      },
    ],
    premiumReport: {
      underpaidScore: 71,
      moneyLeftOnTable: {
        amount: Math.max(Math.round(max - current), 8000),
        currency: currency || "USD",
      },
      negotiationPitch:
        "The current signal suggests there is room to ask for a stronger range, especially if you can tie your experience to measurable business impact.",
      emailSnippet:
        "Thanks for sharing the range. Based on my experience, scope, and the market signals I am seeing for similar roles, I would like to discuss a package closer to the top of the benchmarked range.",
      premiumHighlights: [
        "Skill-by-skill premium analysis tied to your profile.",
        "A clearer underpaid view with negotiation room.",
        "Higher-upside role suggestions you can target next.",
        "Negotiation-ready talking points and email draft.",
      ],
    },
    shareCard: {
      title: "My AI salary benchmark is ready",
      message: `I used an AI salary calculator to benchmark ${roleLabel} pay in ${locationLabel} and got a clearer market-worth range.`,
    },
    methodology:
      "This estimate was generated using general compensation heuristics without real-time market research.",
  };
}

export const POST = async (req) => {
  let tempPath = "";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(type, payload) {
        controller.enqueue(
          encoder.encode(JSON.stringify({ type, ...payload }) + "\n")
        );
      }

      try {
        const formData = await req.formData();
        const file = formData.get("resume");
        const city = formData.get("city");
        const role = formData.get("role");
        const yearsExperience = formData.get("yearsExperience");
        const currentSalary = formData.get("currentSalary");
        const targetSalary = formData.get("targetSalary");
        const currency = formData.get("currency") || "USD";

        if (!city || (!role && !file)) {
          sendEvent("error", {
            message: "Add a city and either a role or a resume to continue.",
          });
          controller.close();
          return;
        }

        let uploadedFile = null;

        if (file) {
          if (!allowedMimeTypes.has(file.type)) {
            sendEvent("error", {
              message: "Use PDF, TXT, DOC, or DOCX files for resume uploads.",
            });
            controller.close();
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            sendEvent("error", {
              message: "Resume uploads must be 5MB or smaller.",
            });
            controller.close();
            return;
          }

          sendEvent("status", { message: "Uploading and processing resume..." });
          const buffer = Buffer.from(await file.arrayBuffer());
          tempPath = `/tmp/${file.name}`;
          await fs.writeFile(tempPath, buffer);
          uploadedFile = await uploadToGemini(tempPath, file.type);
          await waitForFilesActive([uploadedFile]);
        }

        sendEvent("status", { message: "Researching market data..." });
        
        let researchData = null;
        let sources = [];

        try {
          const researchModel = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            tools: [{ googleSearch: {} }],
          });

          const researchPromptText = buildResearchPrompt({
            role,
            city,
            yearsExperience,
            currency,
          });

          const resultStream = await researchModel.generateContentStream({
            contents: [{ role: "user", parts: [{ text: researchPromptText }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 4096,
            },
          });

          let textBuffer = "";
          for await (const chunk of resultStream.stream) {
            const chunkText = chunk.text();
            textBuffer += chunkText;
            sendEvent("thought", { text: chunkText });
          }

          const finalResponse = await resultStream.response;
          sources = extractSources(finalResponse);
          researchData = textBuffer;
        } catch (researchError) {
          console.warn("Research phase failed:", researchError.message);
          // Fallback, no research
        }

        sendEvent("status", { message: "Analyzing data and generating report..." });

        let report;
        try {
          const reportModel = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
          });

          const reportPromptText = buildSalaryReportPrompt({
            role,
            city,
            yearsExperience,
            currentSalary,
            targetSalary,
            currency,
            hasResume: Boolean(uploadedFile),
            researchData,
          });

          const parts = [{ text: reportPromptText }];
          if (uploadedFile) {
            parts.push({
              fileData: {
                mimeType: uploadedFile.mimeType,
                fileUri: uploadedFile.uri,
              },
            });
          }

          const result = await reportModel.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: {
              temperature: 0.5,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 8192,
              responseMimeType: "application/json",
            },
          });

          report = parseModelJson(result.response.text());
        } catch (reportError) {
          console.error("Report generation failed:", reportError);
          report = buildFallbackReport({
            role,
            city,
            yearsExperience,
            currentSalary,
            targetSalary,
            currency,
          });
        }

        sendEvent("result", {
          message: "Your salary estimate is ready.",
          report,
          sources,
        });

      } catch (error) {
        console.error("Error:", error);
        sendEvent("error", { message: "Error processing your request." });
      } finally {
        if (tempPath) {
          await fs.unlink(tempPath).catch(() => {});
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
};