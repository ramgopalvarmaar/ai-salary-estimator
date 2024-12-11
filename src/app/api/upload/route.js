import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name);
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");
    const city = formData.get("city");

    if (!file || !city) {
      return new Response(
        JSON.stringify({ message: "File or city is missing." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = `/tmp/${file.name}`;
    await fs.writeFile(tempPath, buffer);

    const uploadedFile = await uploadToGemini(tempPath, file.type);

    await waitForFilesActive([uploadedFile]);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `I will provide my resume. Can you estimate my potential salary based on my skill set for jobs in ${city}?`,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: uploadedFile.mimeType,
                fileUri: uploadedFile.uri,
              },
            },
            { text: "Here is my resume." },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("");

    await fs.unlink(tempPath);

    return new Response(
      JSON.stringify({ message: result.response.text() }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ message: "Error processing your request." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
