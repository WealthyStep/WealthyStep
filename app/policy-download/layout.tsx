import { constructMetadata, ROUTES_SEO } from "@/lib/seo";

export const metadata = constructMetadata(ROUTES_SEO.policyDownload);

export default function PolicyDownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
