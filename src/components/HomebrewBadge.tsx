import { Box, Tooltip, useTheme, useMediaQuery } from "@mui/material";

/**
 * HomebrewBadge — lightweight badge indicating pkgx's Homebrew heritage.
 * Uses a styled Box instead of MUI Chip to minimize bundle impact.
 *
 * Accessibility: focusable, tooltip, role="status", aria-label.
 * Responsive: smaller text on mobile.
 */
export default function HomebrewBadge() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Tooltip
      title="Max Howell created Homebrew, the package manager for macOS"
      arrow
      placement="bottom"
      enterTouchDelay={0}
    >
      <Box
        component="span"
        role="status"
        aria-label="pkgx is from the creator of Homebrew"
        tabIndex={0}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          border: "1px solid rgba(149, 178, 184, 0.3)",
          borderRadius: "16px",
          px: isxs ? 1.5 : 2,
          py: 0.5,
          color: "text.secondary",
          fontSize: isxs ? 11 : 13,
          fontWeight: 400,
          letterSpacing: 0.3,
          cursor: "default",
          transition: "border-color 0.2s ease, color 0.2s ease",
          "&:hover": {
            borderColor: "primary.main",
            color: "text.primary",
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }}
      >
        <span role="img" aria-hidden="true" style={{ fontSize: isxs ? 14 : 16, lineHeight: 1 }}>
          🍺
        </span>
        {isxs ? "By Homebrew's creator" : "From the creator of Homebrew"}
      </Box>
    </Tooltip>
  );
}
