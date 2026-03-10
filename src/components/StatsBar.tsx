import { cn } from "../utils/cn";
import { useIsMobile } from "../utils/useIsMobile";

const stats = [
  { value: "13,000+", label: "Packages", icon: "📦" },
  { value: "3", label: "Platforms", icon: "🖥️" },
  { value: "Zero", label: "Config needed", icon: "⚡" },
  { value: "~1ms", label: "Startup time", icon: "🚀" },
];

export default function StatsBar() {
  const isxs = useIsMobile();

  return (
    <div className={cn(
      "grid gap-4 w-full max-w-3xl mx-auto",
      isxs ? "grid-cols-2" : "grid-cols-4"
    )}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="text-center py-4 px-3 rounded-xl bg-white/[0.03] border border-[rgba(149,178,184,0.08)]"
        >
          <div className="text-2xl mb-1">{stat.icon}</div>
          <div className="text-2xl font-bold text-[#EDF2EF]">{stat.value}</div>
          <div className="text-xs text-[rgba(237,242,239,0.5)] uppercase tracking-wider mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
