import { useAsync } from "react-use";
import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "../utils/useIsMobile";
import github from "../assets/wordmarks/github.svg";

function useAnimatedCounter(target: number | undefined, durationMs = 1600): string {
  const [display, setDisplay] = useState<string>("");
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }, []);

  const formatNumber = useCallback((n: number): string => {
    return n.toLocaleString("en-US");
  }, []);

  useEffect(() => {
    if (target === undefined || target === null) {
      setDisplay("");
      return;
    }

    if (prefersReducedMotion.current) {
      setDisplay(formatNumber(target));
      return;
    }

    let rafId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(formatNumber(current));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => { if (rafId) cancelAnimationFrame(rafId); };
  }, [target, durationMs, formatNumber]);

  return display;
}

export default function Stars({
  href,
  hideCountIfMobile,
}: {
  href?: string;
  hideCountIfMobile?: boolean;
}) {
  const isxs = useIsMobile();

  const { value: stars } = useAsync(async () => {
    const response = await fetch("/stars.json");
    const data = await response.json();
    const raw = typeof data === "object" && data !== null ? (data.total ?? data.stars ?? data) : data;
    return typeof raw === "string" ? parseInt(raw.replace(/,/g, ""), 10) : Number(raw);
  }, []);

  const animatedStars = useAnimatedCounter(stars);
  const shouldHide = hideCountIfMobile && isxs;

  return (
    <div className="flex items-center">
      <a
        href={href || "https://github.com/pkgxdev/pkgx"}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
        aria-label="View pkgx on GitHub"
      >
        <img src={github} alt="GitHub" />
      </a>
      {!shouldHide && (
        <span
          className="text-[rgba(237,242,239,0.7)] text-[13px] min-w-[44px] overflow-clip tabular-nums"
          title="Total Org. Stars"
          aria-live="polite"
          aria-label={stars ? `${stars.toLocaleString("en-US")} GitHub stars` : "Loading stars"}
        >
          {animatedStars || "\u00A0"}
        </span>
      )}
    </div>
  );
}
