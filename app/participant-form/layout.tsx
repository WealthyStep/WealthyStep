import { constructMetadata, ROUTES_SEO } from "@/lib/seo";

export const metadata = constructMetadata(ROUTES_SEO.participantForm);

export default function ParticipantFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
