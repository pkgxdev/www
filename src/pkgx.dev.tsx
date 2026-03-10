import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import PackageShowcase from "./pkgx.dev/PackageShowcase";
import PackageListing from "./pkgx.dev/PackageListing";
import PrivacyPolicy from "./pkgx.dev/PrivacyPolicy";
import TermsOfUse from "./pkgx.dev/TermsOfUse";
import TeaProtocol from "./pkgx.dev/TeaProtocol";
import CoinListLandingPage from "./pkgx.dev/CoinListLandingPage";
import * as ReactDOM from "react-dom/client";
import Masthead from "./components/Masthead";
import HomeFeed from "./pkgx.dev/HomeFeed";
import Footer from "./components/Footer";
import Search from "./components/Search";
import Stars from "./components/Stars";
import Discord from "./components/Discord";
import { useIsMobile } from "./utils/useIsMobile";
import React from "react";
import "./assets/app.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <div className="flex flex-col p-2 md:p-4 max-w-5xl min-h-screen mx-auto space-y-4">
        <MyMasthead />
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/pkgs" element={<PackageShowcase />} />
          <Route path="/pkgs/*" element={<PackageListing />} />
          <Route path="/tea" element={<TeaProtocol />} />
          <Route path="/coinlist" element={<CoinListLandingPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  </React.StrictMode>
);

function MyMasthead() {
  const isxs = useIsMobile();
  const { pathname } = useLocation();

  let gh = `https://github.com/pkgxdev/`;
  if (pathname.startsWith("/pkgs")) gh += "pantry/";

  const search = <Search />;

  const stuff = (
    <>
      <a
        href="/pkgs/"
        className="px-2 py-1 text-[#EDF2EF] hover:bg-white/10 rounded transition-colors text-sm no-underline"
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
