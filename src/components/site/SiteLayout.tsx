import { TopTicker } from "./TopTicker";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { InlineNewsletter } from "./InlineNewsletter";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <TopTicker />
      <main className="flex-1">{children}</main>
      <InlineNewsletter />
      <SiteFooter />
    </div>
  );
}
