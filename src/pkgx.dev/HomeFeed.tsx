import useInfiniteScroll from "react-infinite-scroll-hook";
import HeroTypography from "../components/HeroTypography";
import { useState, CSSProperties } from "react";
import { useIsMobile } from "../utils/useIsMobile";
import FeedItem from "../utils/FeedItem";
import { useAsync } from "react-use";
import { cn } from "../utils/cn";
import img_pkgx from "../assets/pkgx.webp";
import img_mash from "../assets/mash.webp";
import img_teaBASE from "../assets/teaBASE.webp";
import img_unpkg from "../assets/unpkg.webp";
import img_pkgm from "../assets/pkgm.webp";
import img_dev from "../assets/dev.webp";

export default function HomeFeed() {
  const isxs = useIsMobile();

  return (
    <>
      <div className="text-center pb-6">
        <p className="uppercase tracking-widest text-xs text-[rgba(237,242,239,0.7)]">
          We are Crafters of Fine
        </p>
        <HeroTypography>Open Source</HeroTypography>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
        {[
          { name: "pkgx", desc: "Fast, small, package runner.", href: "https://github.com/pkgxdev/pkgx" },
          { name: "pkgm", desc: "Install pkgx packages to /usr/local.", href: "https://github.com/pkgxdev/pkgm" },
          { name: "dev", desc: "Isolated, reproducible development environments.", href: "https://github.com/pkgxdev/dev" },
          { name: "mash", desc: "The package manager for scripts.", href: "https://github.com/pkgxdev/mash" },
          { name: "pkgo", desc: "Package…GO! Run typically unpackagable OSS in sandboxes.", href: "https://github.com/pkgxdev/pkgo" },
          { name: "pkgxMCP", desc: "Can your LLM run anything? Now it can.", href: "https://github.com/pkgxdev/mcp", variant: "small-caps" },
          { name: "teaBASE", desc: "The Developer Cockpit.", href: "https://github.com/teaxyz/teaBASE", variant: "small-caps" },
        ].map((product) => (
          <a
            key={product.name}
            href={product.href}
            className="block rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] hover:border-[rgba(149,178,184,0.5)] transition-all shadow-md no-underline h-full"
          >
            <div className={cn("p-3", isxs && "p-1.5")}>
              <h2
                className="text-2xl uppercase"
                style={{
                  fontFamily: "shader, Roboto, sans-serif",
                  fontVariant: product.variant || "normal",
                }}
              >
                {product.name}
              </h2>
              <p className="text-sm text-[rgba(237,242,239,0.7)]">{product.desc}</p>
            </div>
          </a>
        ))}
      </div>

      <h2 className="text-xl mt-12">What's New?</h2>

      <Feed />
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
      {items.map((item) => (
        <FeedItemBox key={item.url} {...item} />
      ))}
      {(loading || hasNextPage) && (
        <div className="col-span-full" ref={sentryRef}>
          <div className="h-4 bg-white/5 rounded animate-pulse" />
        </div>
      )}
      {error && (
        <div className="col-span-full">
          <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">
            {error.message}
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
  const borderColor = isBlog
    ? "border-[#F26212]"
    : isMash
    ? "border-[#4156E1]"
    : "border-[rgba(149,178,184,0.3)]";
  const chipBg = isBlog ? "bg-[#F26212]" : isMash ? "bg-[#4156E1]" : "";

  return (
    <a
      href={url}
      className={cn(
        "block rounded-lg border bg-[#0D1117] hover:border-[rgba(149,178,184,0.5)] transition-all no-underline h-full",
        (isBlog || isMash) ? `${borderColor} border-2` : "border-[rgba(149,178,184,0.3)]",
        (isBlog || isMash) && "shadow-md"
      )}
    >
      <div
        className={cn("relative bg-cover bg-center text-right", isxs ? "h-[150px]" : "aspect-square")}
        style={{ backgroundImage: image ? `url(${image})` : undefined }}
      >
        {(isBlog || isMash) && (
          <span
            className={cn(
              "inline-block text-xs px-2 py-0.5 rounded-full font-medium",
              chipBg,
              isBlog ? "text-[#0D1117]" : "text-white",
              isxs ? "m-1" : "m-2"
            )}
            style={{ fontVariant: "small-caps" }}
          >
            {type}
          </span>
        )}
      </div>
      <div className={cn("p-2", isxs && "p-1")}>
        <h3 className="text-xs uppercase tracking-wider truncate">{title}</h3>
        <p className="text-xs text-[rgba(237,242,239,0.7)]">{description}</p>
      </div>
    </a>
  );
}
