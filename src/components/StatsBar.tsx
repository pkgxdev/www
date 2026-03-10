import { useState, useEffect, useRef } from "react";
import { cn } from "../utils/cn";
import { useIsMobile } from "../utils/useIsMobile";

const stats = [
  { value: 13000, suffix: "+", label: "Packages", icon: "📦" },
  { value: 3, suffix: "", label: "Platforms", icon: "🖥️" },
  { value: 0, suffix: "", label: "Config needed", icon: "⚡", displayAs: "Zero" },
  { value: 1, suffix: "ms", prefix: "~", label: "Startup time", icon: "🚀" },
];

function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || end === 0) return;
    const steps = 40;
    const stepDuration = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (step >= steps) {
        clearInterval(timer);
        setCount(end);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
}

export default function StatsBar() {
  const isxs = useIsMobile();

  return (
    <div
      className={cn(
        "grid gap-4 w-full max-w-3xl mx-auto",
        isxs ? "grid-cols-2" : "grid-cols-4"
      )}
      role="list"
      aria-label="pkgx key statistics"
    >
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
}

function StatItem({ value, suffix, prefix, label, icon, displayAs }: {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  icon: string;
  displayAs?: string;
}) {
  const { count, ref } = useCountUp(value);

  const display = displayAs || `${prefix || ""}${count.toLocaleString()}${suffix}`;

  return (
    <div
      ref={ref}
      role="listitem"
      className="text-center py-4 px-3 rounded-xl bg-white/[0.03] border border-[rgba(149,178,184,0.08)] hover:border-[rgba(149,178,184,0.15)] hover:bg-white/[0.05] transition-all duration-300"
    >
      <div className="text-2xl mb-1" aria-hidden="true">{icon}</div>
      <div className="text-2xl font-bold text-[#EDF2EF]">{display}</div>
      <div className="text-xs text-[rgba(237,242,239,0.5)] uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
