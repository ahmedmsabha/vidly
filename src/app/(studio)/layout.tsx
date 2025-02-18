import { StudioLayout } from "@/modules/layout/ui/layouts/studio-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StudioLayout>{children}</StudioLayout>;
}
