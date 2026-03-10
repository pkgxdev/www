import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import * as ReactDOM from "react-dom/client";
import { useIsMobile } from "./utils/useIsMobile";
import Masthead from "./components/Masthead";
import Footer from "./components/Footer";
import Stars from "./components/Stars";
import Hero from "./mash.pkgx.sh/Hero";
import Discord from "./components/Discord";
import LoadingSpinner from "./components/LoadingSpinner";
import "./assets/app.css";

// Lazy load route components
const Listing = lazy(() => import("./mash.pkgx.sh/Listing"));
const Script = lazy(() => import("./mash.pkgx.sh/Script"));

function Body() {
  const isxs = useIsMobile();

  return (
    <div className={`min-w-[1024px] ${isxs ? "p-2 space-y-8" : "p-4 space-y-16"}`}>
      <MyMasthead />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
        <div className="md:col-span-9">
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Listing />} />
                <Route path="/*" element={<Script />} />
              </Routes>
            </Suspense>
          </Router>
        </div>
        <div className="md:col-span-3">
          <Hero />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function MyMasthead() {
  const isxs = useIsMobile();

  return (
    <Masthead left={<span className="font-[shader] text-[#F26212]">MASH</span>}>
      {!isxs && (
        <>
          <a
            href="https://docs.pkgx.sh"
            className="px-2 py-1 text-[#EDF2EF] hover:bg-white/10 rounded transition-colors no-underline text-sm"
          >
            docs
          </a>
          <a
            href="https://pkgx.dev/pkgs/"
            className="px-2 py-1 text-[#EDF2EF] hover:bg-white/10 rounded transition-colors no-underline text-sm"
          >
            pkgs
          </a>
        </>
      )}
      <Discord />
      <Stars href="https://github.com/pkgxdev/mash/" />
    </Masthead>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Body />
  </React.StrictMode>
);
