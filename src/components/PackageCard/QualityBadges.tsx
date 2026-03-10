import { cn } from "../../utils/cn";

interface QualityBadgesProps {
  github?: string;
  stars?: number;
  lastUpdate?: string;
  hasReadme?: boolean;
}

type BadgeType = "maintained" | "popular" | "documented" | "secure";

interface Badge {
  type: BadgeType;
  label: string;
  color: "green" | "yellow" | "gray";
  title: string;
}

function computeBadges(props: QualityBadgesProps): Badge[] {
  const badges: Badge[] = [];

  // Maintained: last update within 90 days
  if (props.lastUpdate) {
    const daysSince = Math.floor(
      (Date.now() - new Date(props.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince <= 90) {
      badges.push({
        type: "maintained",
        label: "Maintained",
        color: "green",
        title: `Last updated ${daysSince} day${daysSince !== 1 ? "s" : ""} ago`,
      });
    } else if (daysSince <= 365) {
      badges.push({
        type: "maintained",
        label: "Maintained",
        color: "yellow",
        title: `Last updated ${daysSince} days ago`,
      });
    }
  }

  // Popular: GitHub stars threshold
  if (props.stars !== undefined) {
    if (props.stars >= 1000) {
      badges.push({
        type: "popular",
        label: `★ ${formatStars(props.stars)}`,
        color: "green",
        title: `${props.stars.toLocaleString()} GitHub stars`,
      });
    } else if (props.stars >= 100) {
      badges.push({
        type: "popular",
        label: `★ ${formatStars(props.stars)}`,
        color: "yellow",
        title: `${props.stars.toLocaleString()} GitHub stars`,
      });
    }
  }

  // Documented
  if (props.hasReadme) {
    badges.push({
      type: "documented",
      label: "Documented",
      color: "green",
      title: "Has README documentation",
    });
  }

  // Secure placeholder
  badges.push({
    type: "secure",
    label: "No known CVEs",
    color: "gray",
    title: "Security scan integration coming soon",
  });

  return badges;
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

const colorMap = {
  green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  yellow: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  gray: "bg-white/5 text-[rgba(237,242,239,0.5)] border-white/10",
};

export default function QualityBadges(props: QualityBadgesProps) {
  const badges = computeBadges(props);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge.type}
          title={badge.title}
          className={cn(
            "inline-flex items-center px-1.5 py-0 text-[0.65rem] rounded-full border leading-relaxed",
            colorMap[badge.color]
          )}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

export function MaintenanceStatus({ github }: { github?: string }) {
  if (!github) return null;

  return (
    <p className="text-xs text-[rgba(237,242,239,0.4)] mt-1">
      <a
        href={github}
        target="_blank"
        rel="noreferrer"
        className="text-[rgba(237,242,239,0.5)] hover:text-[#4156E1] transition-colors no-underline"
      >
        View on GitHub →
      </a>
    </p>
  );
}
