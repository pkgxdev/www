import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useIsMobile } from "../utils/useIsMobile";
import tea from "../assets/wordmarks/tea.svg";
import logo from "../assets/pkgx.svg";
import { cn } from "../utils/cn";

export default function Footer() {
  const year = new Date().getFullYear();
  const isxs = useIsMobile();

  const linkClass = "text-[rgba(237,242,239,0.5)] hover:text-[#EDF2EF] no-underline transition-colors text-sm";

  const copyright = (
    <p className="text-[rgba(237,242,239,0.4)] text-xs mt-4">
      &copy;{year} PKGX INC. All Rights Reserved.
    </p>
  );

  return (
    <footer className="mt-16 -mx-2 md:-mx-4 px-4 md:px-6">
      {/* Top border gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(149,178,184,0.15)] to-transparent mb-12" />

      {/* Footer Grid */}
      <div className={cn("grid gap-8 w-full", isxs ? "grid-cols-1" : "grid-cols-12")}>
        {/* Logo Column */}
        <div className={isxs ? "col-span-1" : "col-span-5"}>
          <img src={logo} alt="pkgx" className="h-[18px] opacity-70" />
          <p className="text-sm text-[rgba(237,242,239,0.4)] mt-3 max-w-xs leading-relaxed">
            The blazingly fast, cross-platform package runner from the creator of Homebrew.
          </p>
          {!isxs && copyright}
        </div>

        {/* Product */}
        <div className={isxs ? "col-span-1" : "col-span-2"}>
          <div className="font-semibold text-xs uppercase tracking-wider text-[rgba(237,242,239,0.6)] mb-3" role="heading" aria-level="2">Product</div>
          <ul className="list-none p-0 m-0 space-y-2">
            <li><a href="https://pkgx.sh" className={linkClass}>pkgx</a></li>
            <li><a href="https://pkgx.app" className={linkClass}>oss.app</a></li>
            <li><a href="https://mash.pkgx.sh" className={linkClass}>mash</a></li>
            <li><a href="https://docs.pkgx.sh" className={linkClass}>docs</a></li>
            <li><a href="https://pkgx.dev/pkgs/" className={linkClass}>pkgs</a></li>
          </ul>
        </div>

        {/* Company */}
        <div className={isxs ? "col-span-1" : "col-span-2"}>
          <div className="font-semibold text-xs uppercase tracking-wider text-[rgba(237,242,239,0.6)] mb-3" role="heading" aria-level="2">Company</div>
          <ul className="list-none p-0 m-0 space-y-2">
            <li><a href="https://pkgx.dev" className={linkClass}>Home</a></li>
            <li><a href="https://pkgx.dev/privacy-policy" className={linkClass}>Privacy Policy</a></li>
            <li><a href="https://pkgx.dev/terms-of-use" className={linkClass}>Terms of Use</a></li>
            <li><a href="https://blog.pkgx.dev" className={linkClass}>Blog</a></li>
            <li>
              <a href="https://drive.google.com/drive/folders/18PMUnaTr2AKpcCGxErK2k7Gok50CKB2y?usp=sharing" className={linkClass}>
                Press Kit
              </a>
            </li>
            <li>
              <a href="mailto:hi@pkgx.dev" className={linkClass}>
                Contact<ArrowUpRight className="w-3 h-3 inline ml-0.5 translate-y-[1px]" />
              </a>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div className={isxs ? "col-span-1" : "col-span-3"}>
          <div className="font-semibold text-xs uppercase tracking-wider text-[rgba(237,242,239,0.6)] mb-3" role="heading" aria-level="2">Community</div>
          <ul className="list-none p-0 m-0 space-y-2">
            <li>
              <a href="https://github.com/pkgxdev" className={linkClass}>
                GitHub<ArrowUpRight className="w-3 h-3 inline ml-0.5 translate-y-[1px]" />
              </a>
            </li>
            <li>
              <a href="https://x.com/pkgxdev" className={linkClass}>
                𝕏<ArrowUpRight className="w-3 h-3 inline ml-0.5 translate-y-[1px]" />
              </a>
            </li>
            <li>
              <a href="https://discord.gg/rNwNUY83XS" className={linkClass}>
                Discord<ArrowUpRight className="w-3 h-3 inline ml-0.5 translate-y-[1px]" />
              </a>
            </li>
            <li>
              <a href="https://web.libera.chat/?channel=#pkgx" className={linkClass}>
                irc:#pkgx<ArrowUpRight className="w-3 h-3 inline ml-0.5 translate-y-[1px]" />
              </a>
            </li>
          </ul>

          {/* tea partnership */}
          <div className="mt-6 pt-4 border-t border-[rgba(149,178,184,0.08)]">
            <div className="flex items-center gap-2 mb-2">
              <img src={tea} alt="tea" className="h-4 opacity-60" />
              <span className="text-xs text-[rgba(237,242,239,0.4)]">Core contributor</span>
            </div>
            <a
              href="https://tea.xyz"
              className="inline-flex items-center gap-1.5 text-xs text-[rgba(237,242,239,0.5)] hover:text-[#74FAD1] transition-colors no-underline"
            >
              Learn More <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {isxs && <div className="col-span-1 pb-4">{copyright}</div>}
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </footer>
  );
}
