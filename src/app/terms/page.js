import LegalPage from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "Review the current terms for using the AI Salary Calculator and salary report preview experience.",
  path: "/terms",
  keywords: ["terms of use", "AI salary calculator terms"],
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="These terms describe the current expectations for using the salary calculator and premium report preview."
    >
      <h2>Use of the product</h2>
      <p>
        The product is intended to help job seekers estimate their market worth and
        preview a deeper salary report experience. You are responsible for how you
        use the results.
      </p>

      <h2>No guarantee of accuracy</h2>
      <p>
        Salary estimates are generated from the context provided to the app and may
        be incomplete, outdated, or inaccurate. They should be treated as planning
        support, not as a guaranteed compensation outcome.
      </p>

      <h2>Acceptable content</h2>
      <p>
        Do not upload unlawful, malicious, or irrelevant files. Only upload
        documents you have the right to use.
      </p>

      <h2>Premium positioning</h2>
      <p>
        The product may offer free estimates alongside paid report features. Paid
        features, pricing, and access rules may change as the app evolves.
      </p>

      <h2>Service changes</h2>
      <p>
        Features may be updated, paused, or removed without notice while the
        product continues to develop.
      </p>
    </LegalPage>
  );
}
