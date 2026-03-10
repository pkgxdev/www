import useInfiniteScroll from "react-infinite-scroll-hook";
import HeroTypography from "../components/HeroTypography";
import HeroSearch from "../components/HeroSearch";
import StatsBar from "../components/StatsBar";
import { useState, useEffect } from "react";
import { useIsMobile } from "../utils/useIsMobile";
import FeedItem from "../utils/FeedItem";
import { useAsync } from "react-use";
import { cn } from "../utils/cn";
import { ArrowUpRight, Terminal as TerminalIcon, Package, Zap, Code2, Globe, Shield, Cpu } from "lucide-react";

export default function HomeFeed() {
  const isxs = useIsMobile();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-[85vh] -mx-2 md:-mx-4 px-4 py-16 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 hero-gradient -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(65,86,225,0.08)_0%,transparent_70%)] -z-10" />

        {/* Homebrew heritage badge */}
        <div className="mb-8 animate-fade-in">
          <a
            href="https://brew.sh"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(149,178,184,0.2)] bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.08] hover:border-[rgba(149,178,184,0.3)] transition-all duration-300 no-underline group"
          >
            <span className="text-lg">🍺</span>
            <span className="text-sm text-[rgba(237,242,239,0.7)] group-hover:text-[#EDF2EF] transition-colors">
              From the creator of <span className="font-semibold text-[#EDF2EF]">Homebrew</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[rgba(237,242,239,0.4)]" />
          </a>
        </div>

        {/* Main headline */}
        <div className="animate-slide-up">
          <HeroTypography className="!text-[52px] md:!text-[96px] leading-[0.95] tracking-tight mb-4">
            Run Anything
          </HeroTypography>
        </div>

        {/* Subheadline */}
        <p className={cn(
          "max-w-xl text-[rgba(237,242,239,0.6)] mb-10 leading-relaxed animate-slide-up",
          isxs ? "text-base px-2" : "text-lg"
        )} style={{ animationDelay: "0.1s" }}>
          The blazingly fast, cross-platform package runner.
          <br className="hidden md:block" />
          {" "}No containers. No VMs. Just run.
        </p>

        {/* Hero search */}
        <div className="w-full animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <HeroSearch />
        </div>

        {/* Stats bar */}
        <div className="mt-14 w-full animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <StatsBar />
        </div>
      </section>

      {/* ===== OUR TOOLS SECTION ===== */}
      <section className="py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.2em] text-xs text-[rgba(237,242,239,0.4)] mb-3">The Ecosystem</p>
          <h2 className="text-3xl md:text-4xl font-light text-[#EDF2EF]" style={{ fontFamily: "shader, Roboto, sans-serif" }}>
            Our Tools
          </h2>
        </div>

        {/* pkgx Hero Card */}
        <a
          href="https://github.com/pkgxdev/pkgx"
          className="block mb-4 rounded-xl border border-[rgba(149,178,184,0.15)] bg-[#0D1117]/60 backdrop-blur-sm hover:border-[#4156E1]/40 hover:shadow-[0_0_40px_rgba(65,86,225,0.08)] transition-all duration-500 no-underline group"
        >
          <div className={cn("p-6 md:p-10", isxs && "p-4")}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3
                  className="text-4xl md:text-5xl uppercase text-[#EDF2EF] group-hover:text-gradient transition-all"
                  style={{ fontFamily: "shader, Roboto, sans-serif" }}
                >
                  pkgx
                </h3>
                <p className="text-[rgba(237,242,239,0.6)] mt-2 text-base md:text-lg">
                  Run anything. Install nothing. The universal package runner.
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[rgba(237,242,239,0.3)] group-hover:text-[#4156E1] transition-colors shrink-0 mt-2" />
            </div>

            {/* Terminal demo */}
            <div className="mt-6 rounded-lg border border-[rgba(149,178,184,0.15)] bg-[#070C14] p-4 font-mono text-sm overflow-x-auto">
              <div className="flex items-center gap-2 mb-3 select-none">
                <div className="w-3 h-3 rounded-full bg-[rgb(255,95,86)]" />
                <div className="w-3 h-3 rounded-full bg-[rgb(255,189,46)]" />
                <div className="w-3 h-3 rounded-full bg-[rgb(39,201,63)]" />
              </div>
              <div className="space-y-1 text-[rgba(237,242,239,0.8)]">
                <p><span className="text-[rgba(237,242,239,0.4)]">$</span> <span className="text-[#4156E1]">pkgx</span> node@22 -- node -e "console.log(<span className="text-[#74FAD1]">'Hello, World!'</span>)"</p>
                <p className="text-[#74FAD1]">Hello, World!</p>
                <p className="mt-2"><span className="text-[rgba(237,242,239,0.4)]">$</span> <span className="text-[#4156E1]">pkgx</span> python@3.12 -- python -c "print(<span className="text-[#74FAD1]">'No install needed'</span>)"</p>
                <p className="text-[#74FAD1]">No install needed</p>
              </div>
            </div>
          </div>
        </a>

        {/* Other products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "pkgm", desc: "Install pkgx packages to /usr/local.", href: "https://github.com/pkgxdev/pkgm", icon: Package },
            { name: "dev", desc: "Isolated, reproducible dev environments.", href: "https://github.com/pkgxdev/dev", icon: Code2 },
            { name: "mash", desc: "The package manager for scripts.", href: "https://github.com/pkgxdev/mash", icon: Zap },
            { name: "pkgo", desc: "Run unpackagable OSS in sandboxes.", href: "https://github.com/pkgxdev/pkgo", icon: Shield },
            { name: "pkgxMCP", desc: "Can your LLM run anything? Now it can.", href: "https://github.com/pkgxdev/mcp", variant: "small-caps" as const, icon: Cpu },
            { name: "teaBASE", desc: "The Developer Cockpit.", href: "https://github.com/teaxyz/teaBASE", variant: "small-caps" as const, icon: Globe },
          ].map((product) => {
            const Icon = product.icon;
            return (
              <a
                key={product.name}
                href={product.href}
                className="group block rounded-xl border border-[rgba(149,178,184,0.12)] bg-[#0D1117]/40 backdrop-blur-sm hover:border-[rgba(149,178,184,0.3)] hover:bg-[#0D1117]/70 hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300 no-underline"
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-[rgba(149,178,184,0.1)] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[rgba(237,242,239,0.5)] group-hover:text-[#4156E1] transition-colors" />
                      </div>
                      <h3
                        className="text-xl uppercase text-[#EDF2EF]"
                        style={{
                          fontFamily: "shader, Roboto, sans-serif",
                          fontVariant: product.variant || "normal",
                        }}
                      >
                        {product.name}
                      </h3>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[rgba(237,242,239,0.2)] group-hover:text-[rgba(237,242,239,0.5)] transition-colors shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-[rgba(237,242,239,0.5)] mt-3 ml-12">{product.desc}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ===== WHAT'S NEW SECTION ===== */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-[#EDF2EF] font-light">What's New</h2>
          <a href="/pkgs/" className="text-sm text-[rgba(237,242,239,0.5)] hover:text-[#4156E1] transition-colors no-underline">
            Browse all packages &rarr;
          </a>
        </div>
        <Feed />
      </section>

      {/* ===== TEA TEASER SECTION ===== */}
      <section className="py-12 md:py-16">
        <div className="rounded-2xl border border-[rgba(149,178,184,0.12)] bg-gradient-to-br from-[#0D1117] via-[#0D1117] to-[rgba(65,86,225,0.05)] p-8 md:p-12 text-center">
          <p className="uppercase tracking-[0.15em] text-xs text-[#F26212] mb-3 font-medium">Powered by the tea Protocol</p>
          <h2 className="text-2xl md:text-3xl font-light text-[#EDF2EF] mb-4">
            Open Source Should Be <span className="text-gradient font-normal">Rewarding</span>
          </h2>
          <p className="text-[rgba(237,242,239,0.5)] max-w-lg mx-auto mb-8 text-sm md:text-base leading-relaxed">
            tea is an Optimism-based L2 that incentivizes open-source contributions.
            Every package, every maintainer, every contributor gets their fair share.
          </p>
          <a
            href="/tea"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#74FAD1] text-[#0A0711] rounded-xl text-sm font-semibold hover:bg-[#5ee8bf] transition-all duration-300 no-underline hover:shadow-[0_0_24px_rgba(116,250,209,0.2)]"
          >
            Learn about tea <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </>
  );
}

function Feed() {
  const isxs = useIsMobile();
  const { loading, items, hasNextPage, error, loadMore } = useLoadItems();

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: "0px 0px 800px 0px",
    delayInMs: 0,
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {items.map((item) => (
        <FeedItemBox key={item.url} {...item} />
      ))}
      {(loading || hasNextPage) && (
        <div className="col-span-full" ref={sentryRef}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl bg-white/[0.02] border border-[rgba(149,178,184,0.08)] overflow-hidden">
                <div className={cn("bg-white/[0.03] animate-pulse", isxs ? "h-[120px]" : "aspect-square")} />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/[0.05] rounded animate-pulse w-3/4" />
                  <div className="h-2 bg-white/[0.03] rounded animate-pulse w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <div className="col-span-full">
          <div className="rounded-xl border border-[rgba(149,178,184,0.1)] bg-white/[0.02] p-8 text-center">
            <div className="text-3xl mb-3">📡</div>
            <p className="text-[rgba(237,242,239,0.6)] text-sm mb-3">Feed temporarily unavailable</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-[#4156E1] hover:text-[#74FAD1] transition-colors bg-transparent border border-[#4156E1]/30 rounded-lg px-4 py-2 cursor-pointer hover:border-[#4156E1]/60"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function useLoadItems() {
  const [index, setIndex] = useState(0);
  const async_result = useAsync(async () => {
    const rsp = await fetch("https://pkgx.dev/index.json");
    if (!rsp.ok) throw new Error(rsp.statusText);
    const data = (await rsp.json()) as FeedItem[];
    setIndex(Math.min(data.length, 25));
    return data;
  });
  return {
    loading: async_result.loading,
    items: (async_result.value ?? []).slice(0, index),
    hasNextPage: async_result.value ? index < async_result.value.length : false,
    error: async_result.error,
    loadMore: () => setIndex((index) => Math.min(index + 25, async_result.value?.length ?? 0)),
  };
}

function FeedItemBox(item: FeedItem) {
  const isxs = useIsMobile();
  const { url, title, description, type, image } = item;

  const isBlog = type === "blog";
  const isMash = type === "mash";

  return (
    <a
      href={url}
      className={cn(
        "group block rounded-xl overflow-hidden border bg-[#0D1117]/40 backdrop-blur-sm hover:border-[rgba(149,178,184,0.3)] transition-all duration-300 no-underline h-full",
        isBlog ? "border-[#F26212]/40 hover:border-[#F26212]/60" :
        isMash ? "border-[#4156E1]/40 hover:border-[#4156E1]/60" :
        "border-[rgba(149,178,184,0.1)]"
      )}
    >
      <div
        className={cn("relative bg-cover bg-center", isxs ? "h-[120px]" : "aspect-square")}
        style={{ backgroundImage: image ? `url(${image})` : undefined, backgroundColor: image ? undefined : "rgba(255,255,255,0.02)" }}
      >
        {(isBlog || isMash) && (
          <span
            className={cn(
              "absolute top-2 right-2 text-[0.6rem] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider",
              isBlog ? "bg-[#F26212] text-[#0D1117]" : "bg-[#4156E1] text-white"
            )}
          >
            {type}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-xs font-medium uppercase tracking-wider truncate text-[#EDF2EF] group-hover:text-gradient transition-all">{title}</h3>
        {description && (
          <p className="text-xs text-[rgba(237,242,239,0.5)] mt-1 line-clamp-2">{description}</p>
        )}
      </div>
    </a>
  );
}
