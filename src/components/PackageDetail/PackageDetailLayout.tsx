import { ReactNode } from "react";
import { useIsMobile } from "../../utils/useIsMobile";
import { cn } from "../../utils/cn";

interface PackageDetailLayoutProps {
  /** Package header area (name, version, stars) */
  header: ReactNode;
  /** Quick install tabbed area */
  install: ReactNode;
  /** Trust signal badges row */
  trustSignals: ReactNode;
  /** Sidebar content: versions, deps, links */
  sidebar: ReactNode;
  /** Main content: README, usage, changelog */
  mainContent: ReactNode;
}

/**
 * PackageDetailLayout
 *
 * Responsive layout for individual package detail pages.
 *
 * Desktop:
 * ┌─────────────────────────────────────┐
 * │ Package Header (name, version, ★)  │
 * ├─────────────────────────────────────┤
 * │ Quick Install (tabbed: pkgx/brew)  │
 * ├─────────────────────────────────────┤
 * │ Trust Signals Row (badges)          │
 * ├──────────────┬──────────────────────┤
 * │ Sidebar      │ Main Content         │
 * │ - Versions   │ - README             │
 * │ - Deps       │ - Usage Examples     │
 * │ - Links      │ - Changelog          │
 * └──────────────┴──────────────────────┘
 *
 * Mobile: stacks vertically, sidebar after main content.
 */
export default function PackageDetailLayout({
  header,
  install,
  trustSignals,
  sidebar,
  mainContent,
}: PackageDetailLayoutProps) {
  const isxs = useIsMobile();

  return (
    <div className="space-y-6" role="article" aria-label="Package details">
      {/* Header Section */}
      <section aria-label="Package header">{header}</section>

      {/* Install Section */}
      <section aria-label="Installation">{install}</section>

      {/* Trust Signals */}
      <section aria-label="Trust signals">{trustSignals}</section>

      {/* Sidebar + Main Content */}
      <div
        className={cn(
          "gap-6",
          isxs ? "flex flex-col" : "grid grid-cols-[280px_1fr]"
        )}
      >
        {/* Sidebar: on mobile, render after main content */}
        {isxs ? (
          <>
            <section aria-label="Package content" className="min-w-0">
              {mainContent}
            </section>
            <aside aria-label="Package sidebar" className="space-y-6">
              {sidebar}
            </aside>
          </>
        ) : (
          <>
            <aside
              aria-label="Package sidebar"
              className="space-y-6 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto pr-2 scrollbar-thin"
            >
              {sidebar}
            </aside>
            <section aria-label="Package content" className="min-w-0 space-y-6">
              {mainContent}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
