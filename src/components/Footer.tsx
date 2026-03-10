import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useIsMobile } from "../utils/useIsMobile";
import tea from "../assets/wordmarks/tea.svg";
import logo from "../assets/pkgx.svg";

export default function Footer() {
  const year = new Date().getFullYear();
  const isxs = useIsMobile();

  const linkClass = "text-[rgba(237,242,239,0.7)] hover:text-[#EDF2EF] no-underline transition-colors text-sm";

  const copyright = (
    <p className="text-[rgba(237,242,239,0.7)] text-sm mt-2">
      &copy;{year} PKGX INC. All Rights Reserved.
    </p>
  );

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Tea Partnership Banner */}
      <div className={`flex ${isxs ? "flex-col" : "flex-row"} items-center gap-${isxs ? "2" : "3"} mt-16`}>
        <img src={tea} alt="tea" className="h-5" />
        <p>pkgx is a core contributor to the tea protocol</p>
        <a
          href="https://tea.xyz"
          className="inline-flex items-center gap-2 border border-current rounded px-3 py-1 text-sm hover:bg-white/5 transition-colors no-underline"
        >
          Learn More <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Footer Grid */}
      <div className={`grid ${isxs ? "grid-cols-1" : "grid-cols-11"} gap-4 w-full`}>
        {/* Logo Column */}
        <div className={isxs ? "col-span-1" : "col-span-5"}>
          <img src={logo} alt="pkgx" className="h-[18px]" />
          {!isxs && copyright}
        </div>

        {/* Product */}
        <div className={isxs ? "col-span-1" : "col-span-2"}>
          <h5 className="font-bold text-sm">Product</h5>
          <ul className="list-none p-0 m-0 mt-2 space-y-0.5 text-sm">
            <li><a href="https://pkgx.sh" className={linkClass}>pkgx</a></li>
            <li><a href="https://pkgx.app" className={linkClass}>oss.app</a></li>
            <li><a href="https://mash.pkgx.sh" className={linkClass}>mash</a></li>
            <li><a href="https://docs.pkgx.sh" className={linkClass}>docs</a></li>
            <li><a href="https://pkgx.dev/pkgs/" className={linkClass}>pkgs</a></li>
          </ul>
        </div>

        {/* Company */}
        <div className={isxs ? "col-span-1" : "col-span-2"}>
          <h5 className="font-bold text-sm">Company</h5>
          <ul className="list-none p-0 m-0 mt-2 space-y-0.5 text-sm">
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
        <div className={isxs ? "col-span-1" : "col-span-2"}>
          <h5 className="font-bold text-sm">Community</h5>
          <ul className="list-none p-0 m-0 mt-2 space-y-0.5 text-sm">
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
        </div>

        {isxs && <div className="col-span-1">{copyright}</div>}
      </div>
    </div>
  );
}
