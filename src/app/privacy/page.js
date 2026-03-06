import LegalPage from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read how the AI Salary Calculator handles form inputs, optional resume uploads, and estimate generation.",
  path: "/privacy",
  keywords: ["privacy policy", "resume upload privacy", "AI salary calculator"],
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This page explains, at a high level, how the current app handles optional resume uploads and salary estimate requests."
    >
      <h2>What we collect</h2>
      <p>
        The calculator uses the details you enter, such as role, city, experience,
        currency, and optional salary targets, to generate a market-worth estimate.
      </p>
      <p>
        Resume upload is optional. If you upload a file, it is used to provide
        more personalized salary and negotiation insights.
      </p>

      <h2>How estimates are generated</h2>
      <p>
        The app sends the request data, and any optional resume file you provide,
        through the AI workflow used to generate the estimate and report preview.
      </p>
      <p>
        Temporary files may be created during processing so the estimate can be
        generated successfully.
      </p>

      <h2>What this policy does not promise</h2>
      <p>
        The current product provides informational estimates only. It should not be
        treated as legal, tax, employment, or financial advice.
      </p>
      <p>
        Because the application is still early-stage, do not upload sensitive
        personal information that is not necessary for salary estimation.
      </p>

      <h2>Updates</h2>
      <p>
        As monetization, analytics, and customer support workflows evolve, this
        policy should be updated to reflect those changes more precisely.
      </p>
    </LegalPage>
  );
}
