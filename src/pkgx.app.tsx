import React, { useState } from "react";
import * as ReactDOM from "react-dom/client";
import { useIsMobile } from "./utils/useIsMobile";
import HeroTypography from "./components/HeroTypography";
import Masthead from "./components/Masthead";
import Footer from "./components/Footer";
import gui from "./assets/gui.webp";
import { cn } from "./utils/cn";
import "./assets/app.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Body />
  </React.StrictMode>
);

function Body() {
  const isxs = useIsMobile();

  return (
    <div className={cn("flex flex-col max-w-2xl mx-auto", isxs ? "p-2 gap-4" : "p-4 gap-8")}>
      <Masthead />

      <div className="text-center space-y-4">
        <HeroTypography>Open Source is a Treasure Trove</HeroTypography>
        <p className="text-xl my-2">What jewel will you discover today?</p>
      </div>

      <div className="text-center">
        <img src={gui} className="w-full h-full" alt="pkgx app" loading="lazy" />
      </div>

      <Download />

      <div className={cn("grid gap-4", isxs ? "grid-cols-1" : "grid-cols-2")}>
        <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] p-4">
          <h3 className="text-lg font-semibold">One Click Installs</h3>
          <p className="text-[rgba(237,242,239,0.7)] my-4">
            Say goodbye to the days of scavenging through cluttered docs. <code>oss.app</code> enables you to query our expansive pkgdb and install your desired version of any package with one click.
          </p>
        </div>
        <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] p-4 h-full">
          <h3 className="text-lg font-semibold">
            Complementing <code>pkgx</code>
          </h3>
          <p className="text-[rgba(237,242,239,0.7)] my-4">
            We believe command line interfaces and graphical user interfaces are <i>complements</i> and should not necessarily share the same features.
          </p>
          <p className="text-[rgba(237,242,239,0.7)] my-4">
            Our cli is precise and powerful where our gui is optimized for discovery and batch operations.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Download() {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center">
      <button
        onClick={() => setOpen(true)}
        className="bg-[#4156E1] text-white px-6 py-3 rounded font-medium text-lg hover:bg-[#3348c4] transition-colors cursor-pointer border-0"
      >
        Download <code>oss.app</code>
      </button>

      {open && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-dialog-title"
        >
          <div 
            className="bg-[#161B22] border border-[rgba(149,178,184,0.3)] rounded-lg p-6" 
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <h3 id="download-dialog-title" className="text-lg font-semibold mb-4">Which Platform?</h3>
            <div className="flex gap-4">
              <a
                href="https://gui.pkgx.dev/release/ossapp-latest-arm64.dmg"
                className="bg-[#4156E1] text-white px-6 py-3 rounded font-medium hover:bg-[#3348c4] transition-colors no-underline"
              >
                Apple Silicon
              </a>
              <a
                href="https://gui.pkgx.dev/release/ossapp-latest.dmg"
                className="bg-[#4156E1] text-white px-6 py-3 rounded font-medium hover:bg-[#3348c4] transition-colors no-underline"
              >
                macOS Intel
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
