import { ArrowRight, Copy } from "lucide-react";
import React, { useState } from "react";
import { useIsMobile } from "../utils/useIsMobile";
import HeroTypography from "../components/HeroTypography";
import HomebrewBadge from "../components/HomebrewBadge";
import { useSearchParams } from "react-router-dom";
import { cn } from "../utils/cn";

export default function Hero() {
  const isxs = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams({ via: "brew" });
  const [copied, setCopied] = useState(false);

  const text = () =>
    searchParams.get("via") === "brew" ? "brew install pkgx" : "curl -Ssf https://pkgx.sh | sh";

  const click = () => {
    navigator.clipboard.writeText(text());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("flex flex-col items-center text-center mx-auto gap-6", !isxs && "mt-22")}>
      <HomebrewBadge />
      <HeroTypography>Run Anything</HeroTypography>

      <p className={cn("text-lg px-2 mt-6", !isxs && "max-w-[570px]")}>
        <code>pkgx</code> is a blazingly fast, standalone, cross&#x2011;platform binary that <i>runs anything</i>
      </p>

      <div className={cn("w-full", isxs ? "w-[90vw]" : "w-[570px] px-10")}>
        <div
          className="halo relative flex items-center bg-transparent border border-[rgba(149,178,184,0.3)] rounded px-3 py-2 cursor-pointer hover:border-[#4156E1] transition-colors"
          onClick={click}
          title="Click to Copy"
        >
          <span className="font-mono text-sm flex-1">{text()}</span>
          <Copy className="w-4 h-4 text-[rgba(237,242,239,0.5)] ml-2" />
        </div>

        {copied && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#4156E1] text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
            Copied to Clipboard
          </div>
        )}

        <div className="flex items-end mt-2 px-2">
          <div className="flex">
            <button
              onClick={() => setSearchParams({ via: "brew" })}
              className={cn(
                "px-3 py-1 text-sm border-b-2 bg-transparent cursor-pointer transition-colors",
                searchParams.get("via") === "brew"
                  ? "border-[#4156E1] text-[#EDF2EF]"
                  : "border-transparent text-[rgba(237,242,239,0.5)] hover:text-[#EDF2EF]"
              )}
            >
              brew
            </button>
            <button
              onClick={() => setSearchParams({ via: "curl" })}
              className={cn(
                "px-3 py-1 text-sm border-b-2 bg-transparent cursor-pointer transition-colors",
                searchParams.get("via")?.toLowerCase() === "curl"
                  ? "border-[#4156E1] text-[#EDF2EF]"
                  : "border-transparent text-[rgba(237,242,239,0.5)] hover:text-[#EDF2EF]"
              )}
            >
              cURL
            </button>
          </div>
          <div className="flex-1" />
          <a
            href="https://docs.pkgx.sh/installing-w/out-brew"
            className="inline-flex items-center gap-1 text-sm text-[rgba(237,242,239,0.7)] hover:text-[#EDF2EF] no-underline transition-colors mt-1"
          >
            other ways {isxs || "to install"} <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
