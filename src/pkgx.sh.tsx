import React from "react";
import * as ReactDOM from "react-dom/client";
import { useIsMobile } from "./utils/useIsMobile";
import Masthead from "./components/Masthead";
import Footer from "./components/Footer";
import Hero from "./pkgx.sh/Hero";
import { RunAnything, RunAnywhere, Dev, Trusted, Quote } from "./pkgx.sh/Landing";
import Stars from "./components/Stars";
import Discord from "./components/Discord";
import "./assets/app.css";
import { BrowserRouter } from "react-router-dom";

function Body() {
  const isxs = useIsMobile();

  return (
    <BrowserRouter>
      <div className={`max-w-2xl mx-auto ${isxs ? "p-2 space-y-8" : "p-4 space-y-16"}`}>
        <MyMasthead />
        <Hero />
        <RunAnything />
        <Quote />
        <RunAnywhere />
        <Dev />
        <Trusted />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function MyMasthead() {
  const isxs = useIsMobile();

  return (
    <Masthead>
      <a
        href="https://docs.pkgx.sh"
        className={`px-2 py-1 text-[#EDF2EF] hover:bg-white/10 rounded transition-colors no-underline ${isxs ? "text-xs" : "text-sm"}`}
      >
        docs
      </a>
      <a
        href="https://pkgx.dev/pkgs/"
        className={`px-2 py-1 text-[#EDF2EF] hover:bg-white/10 rounded transition-colors no-underline ${isxs ? "text-xs" : "text-sm"}`}
      >
        pkgs
      </a>
      <Discord />
      <Stars hideCountIfMobile />
    </Masthead>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Body />
  </React.StrictMode>
);
