import { useMemo } from "react";
import { cn } from "../../utils/cn";

interface TrustSignalsProps {
  github?: string;
  stars?: number;
  lastUpdate?: string;
  hasReadme?: boolean;
  isVerified?: boolean;
}

type SignalLevel = "strong" | "moderate" | "neutral" | "absent";

interface TrustSignal {
  key: string;
  icon: string;
  label: string;
  level: SignalLevel;
  title: string;
  detail: string;
}

const LEVEL_STYLES: Record<SignalLevel, string> = {
  strong: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  moderate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  neutral: "bg-white/5 text-[rgba(237,242,239,0.5)] border-white/10",
  absent: "bg-white/[0.02] text-[rgba(237,242,239,0.25)] border-white/5",
};

function computeSignals(props: TrustSignalsProps): TrustSignal[] {
  const signals: TrustSignal[] = [];

  // Maintained
  if (props.lastUpdate) {
    const daysSince = Math.floor(
      (Date.now() - new Date(props.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince <= 30) {
      signals.push({
        key: "maintained",
        icon: "✓",
        label: "Actively Maintained",
        level: "strong",
        title: `Last updated ${daysSince} day${daysSince !== 1 ? "s" : ""} ago`,
        detail: "Regular updates indicate active development.",
      });
    } else if (daysSince <= 90) {
      signals.push({
        key: "maintained",
        icon: "✓",
        label: "Maintained",
        level: "strong",
        title: `Last updated ${daysSince} days ago`,
        detail: "Updated within the last 90 days.",
      });
    } else if (daysSince <= 365) {
      signals.push({
        key: "maintained",
        icon: "~",
        label: "Maintained",
        level: "moderate",
        title: `Last updated ${daysSince} days ago`,
        detail: "Updated within the last year, but less frequently.",
      });
    } else {
      signals.push({
        key: "maintained",
        icon: "!",
        label: "Stale",
        level: "absent",
        title: `Last updated ${daysSince} days ago`,
        detail: "No updates in over a year.",
      });
    }
  }

  // Popular (GitHub stars)
  if (props.stars !== undefined) {
    if (props.stars >= 10000) {
      signals.push({
        key: "popular",
        icon: "★",
        label: formatStars(props.stars),
        level: "strong",
        title: `${props.stars.toLocaleString()} GitHub stars`,
        detail: "Widely adopted and trusted by the community.",
      });
    } else if (props.stars >= 1000) {
      signals.push({
        key: "popular",
        icon: "★",
        label: formatStars(props.stars),
        level: "strong",
        title: `${props.stars.toLocaleString()} GitHub stars`,
        detail: "Significant community adoption.",
      });
    } else if (props.stars >= 100) {
      signals.push({
        key: "popular",
        icon: "★",
        label: formatStars(props.stars),
        level: "moderate",
        title: `${props.stars.toLocaleString()} GitHub stars`,
        detail: "Growing community interest.",
      });
    }
  }

  // Security
  signals.push({
    key: "secure",
    icon: "🔒",
    label: "No Known CVEs",
    level: "neutral",
    title: "No known vulnerabilities",
    detail: "Security scan integration coming soon.",
  });

  // Documented
  if (props.hasReadme) {
    signals.push({
      key: "documented",
      icon: "📖",
      label: "Documented",
      level: "strong",
      title: "Has README documentation",
      detail: "Package includes documentation for usage guidance.",
    });
  }

  // Verified (tea protocol)
  if (props.isVerified) {
    signals.push({
      key: "verified",
      icon: "✓",
      label: "Verified",
      level: "strong",
      title: "tea protocol verified",
      detail: "Verified through the tea protocol.",
    });
  }

  return signals;
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k stars`;
  return `${n} stars`;
}

export default function TrustSignals(props: TrustSignalsProps) {
  const signals = useMemo(() => computeSignals(props), [
    props.github,
    props.stars,
    props.lastUpdate,
    props.hasReadme,
    props.isVerified,
  ]);

  if (signals.length === 0) return null;

  return (
    <div
      className="flex flex-wrap gap-2"
      role="list"
      aria-label="Trust signals"
    >
      {signals.map((signal) => (
        <TrustBadge key={signal.key} signal={signal} />
      ))}
    </div>
  );
}

function TrustBadge({ signal }: { signal: TrustSignal }) {
  return (
    <div
      role="listitem"
      title={signal.title}
      aria-label={`${signal.label}: ${signal.detail}`}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors",
        LEVEL_STYLES[signal.level],
        signal.level !== "absent" && "hover:brightness-110"
      )}
    >
      <span className="text-base leading-none" aria-hidden="true">
        {signal.icon}
      </span>
      <span className="font-medium">{signal.label}</span>
    </div>
  );
}

/** GitHub link with "View on GitHub" */
export function GitHubLink({ github }: { github?: string }) {
  if (!github) return null;

  return (
    <a
      href={github}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-[rgba(237,242,239,0.5)] hover:text-[#4156E1] transition-colors no-underline"
      aria-label="View on GitHub"
    >
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
      View on GitHub &rarr;
    </a>
  );
}
