import LandingPage from "@/components/LandingPage";
import { landingPages } from "@/lib/landingPages";
import { buildMetadata } from "@/lib/seo";

const page = landingPages.calculator;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  keywords: [page.primaryKeyword, ...page.secondaryKeywords],
});

export default function AiSalaryCalculatorPage() {
  return <LandingPage page={page} />;
}
