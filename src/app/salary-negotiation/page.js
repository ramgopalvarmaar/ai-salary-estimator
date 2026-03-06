import LandingPage from "@/components/LandingPage";
import { landingPages } from "@/lib/landingPages";
import { buildMetadata } from "@/lib/seo";

const page = landingPages.negotiation;

export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  keywords: [page.primaryKeyword, ...page.secondaryKeywords],
});

export default function SalaryNegotiationPage() {
  return <LandingPage page={page} />;
}
