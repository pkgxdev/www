import { Stack, IconButton, Box, Tooltip, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useAsync } from "react-use";
import { useState, useEffect, useRef, useCallback } from "react";
import github from "../assets/wordmarks/github.svg";

/**
 * Animated star counter that counts from 0 to the actual value.
 * Uses requestAnimationFrame for smooth 60fps animation.
 * Respects prefers-reduced-motion: skips animation and shows final value instantly.
 */
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

    // Respect reduced motion preference
    if (prefersReducedMotion.current) {
      setDisplay(formatNumber(target));
      return;
    }

    let rafId: number;
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease-out cubic for satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * eased);

      setDisplay(formatNumber(current));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target, durationMs, formatNumber]);

  return display;
}

export default function Stars({ href, hideCountIfMobile }: { href?: string; hideCountIfMobile?: boolean }) {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down("md"));

  const { value: stars } = useAsync(async () => {
    const response = await fetch("/stars.json");
    const data = await response.json();
    // Handle both number and string formats
    const raw = typeof data === "object" && data !== null ? (data.total ?? data.stars ?? data) : data;
    return typeof raw === "string" ? parseInt(raw.replace(/,/g, ""), 10) : Number(raw);
  }, []);

  const animatedStars = useAnimatedCounter(stars);
  const shouldHide = hideCountIfMobile && isxs;

  return (
    <Stack spacing={0} direction="row" alignItems="center">
      <IconButton
        href={href || "https://github.com/pkgxdev/pkgx"}
        aria-label="View pkgx on GitHub"
      >
        <Box component="img" src={github} alt="GitHub" />
      </IconButton>
      {!shouldHide && (
        <Tooltip title="Total Org. Stars" arrow placement="right" enterTouchDelay={0}>
          <Typography
            color="text.secondary"
            fontSize={13}
            component="span"
            aria-live="polite"
            aria-label={stars ? `${stars.toLocaleString("en-US")} GitHub stars` : "Loading stars"}
            sx={{
              minWidth: 44,
              overflow: "clip",
              fontVariantNumeric: "tabular-nums",
              fontFeatureSettings: '"tnum"',
            }}
          >
            {animatedStars || "\u00A0"}
          </Typography>
        </Tooltip>
      )}
    </Stack>
  );
}
