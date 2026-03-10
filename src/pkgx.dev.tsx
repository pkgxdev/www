import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import CommandPalette from "./components/CommandPalette";
import Masthead from "./components/Masthead";
import Footer from "./components/Footer";
import Search from "./components/Search";
import Stars from "./components/Stars";
import Discord from "./components/Discord";
import LoadingSpinner from "./components/LoadingSpinner";
import { useIsMobile } from "./utils/useIsMobile";
import React, { lazy, Suspense } from "react";
import "./assets/app.css";

// Lazy load route components for code splitting
const PackageShowcase = lazy(() => import("./pkgx.dev/PackageShowcase"));
const PackageListing = lazy(() => import("./pkgx.dev/PackageListing"));
const PrivacyPolicy = lazy(() => import("./pkgx.dev/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pkgx.dev/TermsOfUse"));
const TeaProtocol = lazy(() => import("./pkgx.dev/TeaProtocol"));
const CoinListLandingPage = lazy(() => import("./pkgx.dev/CoinListLandingPage"));
const HomeFeed = lazy(() => import("./pkgx.dev/HomeFeed"));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      {/* Global command palette (⌘K) */}
      <CommandPalette />
      {/* Skip to content link (accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#4156E1] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
      >
        Skip to content
      </a>
      <div className="flex flex-col px-2 md:px-6 max-w-6xl min-h-screen mx-auto">
        <MyMasthead />
        <main id="main-content" className="flex-1" role="main">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomeFeed />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/pkgs" element={<PackageShowcase />} />
              <Route path="/pkgs/*" element={<PackageListing />} />
              <Route path="/tea" element={<TeaProtocol />} />
              <Route path="/coinlist" element={<CoinListLandingPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  </React.StrictMode>
);

function MyMasthead() {
  const isxs = useIsMobile();
  const { pathname } = useLocation();

  let gh = "https://github.com/pkgxdev/";
  if (pathname.startsWith("/pkgs")) gh += "pantry/";

  const search = <Search />;

  const stuff = (
    <>
      <a
        href="/pkgs/"
        className="px-3 py-1.5 text-[rgba(237,242,239,0.6)] hover:text-[#EDF2EF] hover:bg-white/[0.05] rounded-lg transition-all text-sm no-underline"
      >
        pkgs
      </a>
      <Discord />
      <Stars href={gh} hideCountIfMobile={true} />
    </>
  );

  return (
    <Masthead>
      {pathname.startsWith("/pkgs") && isxs ? null : stuff}
      {pathname.startsWith("/pkgs") || !isxs ? search : undefined}
    </Masthead>
  );
}
