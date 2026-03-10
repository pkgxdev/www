import { useIsMobile } from "../utils/useIsMobile";
import { useState, useEffect } from "react";
import { cn } from "../utils/cn";
import logo from "../assets/wordmarks/pkgx.svg";

export default function Masthead({
  children,
  left,
}: {
  children?: React.ReactNode;
  left?: React.ReactNode;
}) {
  const isxs = useIsMobile();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-50 flex items-center gap-3 -mx-2 md:-mx-4 px-4 md:px-6 py-3 transition-all duration-300",
        scrolled
          ? "bg-[#0A0711]/85 backdrop-blur-xl border-b border-[rgba(149,178,184,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <a href="https://pkgx.dev" className="no-underline">
        <img
          src={logo}
          alt="pkgx"
          className={cn("block transition-all duration-300", isxs ? "h-5" : "h-6")}
        />
      </a>
      {left}
      <div className="flex-grow" />
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
}
