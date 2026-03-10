import { useIsMobile } from "../utils/useIsMobile";

export default function HomebrewBadge() {
  const isxs = useIsMobile();

  return (
    <span
      role="status"
      aria-label="pkgx is from the creator of Homebrew"
      tabIndex={0}
      title="Max Howell created Homebrew, the package manager for macOS"
      className={`
        inline-flex items-center gap-1.5
        border border-[rgba(149,178,184,0.3)] rounded-2xl
        ${isxs ? "px-1.5" : "px-2"} py-0.5
        text-[rgba(237,242,239,0.7)] ${isxs ? "text-[11px]" : "text-[13px]"}
        font-normal tracking-wide cursor-default
        transition-all duration-200
        hover:border-[#4156E1] hover:text-[#EDF2EF]
        focus-visible:outline-2 focus-visible:outline-[#4156E1] focus-visible:outline-offset-2
      `}
    >
      <span role="img" aria-hidden="true" className={`${isxs ? "text-sm" : "text-base"} leading-none`}>
        🍺
      </span>
      {isxs ? "By Homebrew's creator" : "From the creator of Homebrew"}
    </span>
  );
}
