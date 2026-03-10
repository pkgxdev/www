import useInfiniteScroll from "react-infinite-scroll-hook";
import { CSSProperties, useMemo, useState, useCallback } from "react";
import { useIsMobile } from "../utils/useIsMobile";
import get_pkg_name from "../utils/pkg-name";
import { useAsync } from "react-use";
import { cn } from "../utils/cn";
import { X, Package, Search as SearchIcon, ArrowUpRight } from "lucide-react";

const CATEGORIES: Record<string, { label: string; emoji: string; match: (pkg: Package) => boolean }> = {
  all: { label: "All", emoji: "📦", match: () => true },
  node: { label: "Node.js", emoji: "🟩", match: (p) => p.labels?.includes("node") ?? false },
  python: { label: "Python", emoji: "🐍", match: (p) => p.labels?.includes("python") ?? false },
  rust: { label: "Rust", emoji: "🦀", match: (p) => p.labels?.includes("rust") ?? false },
  go: { label: "Go", emoji: "🐹", match: (p) => p.labels?.includes("go") ?? false },
  ruby: { label: "Ruby", emoji: "💎", match: (p) => p.labels?.includes("ruby") ?? false },
  java: { label: "Java", emoji: "☕", match: (p) => p.labels?.includes("java") ?? false },
  c: { label: "C/C++", emoji: "⚙️", match: (p) => (p.labels?.includes("c") || p.labels?.includes("c++")) ?? false },
};

type SortOption = "newest" | "oldest" | "alphabetical";

const POPULAR_SUGGESTIONS = [
  { project: "python.org", name: "Python" },
  { project: "nodejs.org", name: "Node.js" },
  { project: "rust-lang.org", name: "Rust" },
  { project: "go.dev", name: "Go" },
  { project: "docker.com", name: "Docker" },
  { project: "git-scm.com", name: "Git" },
];

export default function Showcase() {
  const isxs = useIsMobile();
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterText, setFilterText] = useState("");

  const { loading, allItems, error } = useLoadAllItems();

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const [key, { match }] of Object.entries(CATEGORIES)) {
      counts[key] = allItems.filter(match).length;
    }
    return counts;
  }, [allItems]);

  const processedItems = useMemo(() => {
    let items = [...allItems];

    if (category !== "all" && CATEGORIES[category]) {
      items = items.filter(CATEGORIES[category].match);
    }

    if (filterText.trim()) {
      const q = filterText.toLowerCase().trim();
      items = items.filter((pkg) => {
        const project = pkg.project?.toLowerCase() || "";
        const name = (pkg.name || "").toLowerCase();
        const desc = (pkg.description || pkg.brief || "").toLowerCase();
        return project.includes(q) || name.includes(q) || desc.includes(q);
      });
    }

    switch (sortBy) {
      case "newest":
        items.sort((a, b) => new Date(b.birthtime || 0).getTime() - new Date(a.birthtime || 0).getTime());
        break;
      case "oldest":
        items.sort((a, b) => new Date(a.birthtime || 0).getTime() - new Date(b.birthtime || 0).getTime());
        break;
      case "alphabetical":
        items.sort((a, b) => (a.name || a.project || "").localeCompare(b.name || b.project || ""));
        break;
    }

    return items;
  }, [allItems, category, sortBy, filterText]);

  const [visibleCount, setVisibleCount] = useState(25);
  const visibleItems = processedItems.slice(0, visibleCount);
  const hasNextPage = visibleCount < processedItems.length;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: () => setVisibleCount((c) => Math.min(c + 25, processedItems.length)),
    disabled: !!error,
    rootMargin: "0px 0px 800px 0px",
    delayInMs: 0,
  });

  useMemo(() => {
    setVisibleCount(25);
  }, [category, sortBy, filterText]);

  const clearFilters = useCallback(() => {
    setCategory("all");
    setFilterText("");
    setSortBy("newest");
  }, []);

  const hasActiveFilters = category !== "all" || filterText.trim() !== "" || sortBy !== "newest";

  return (
    <>
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <h1 className={cn("text-xl", isxs && "text-center w-full")}>
          Available Packages{" "}
          <span className="text-[rgba(237,242,239,0.7)] text-lg">
            {new Intl.NumberFormat().format(processedItems.length)}
          </span>
        </h1>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-[rgba(149,178,184,0.2)] text-[rgba(237,242,239,0.6)] bg-transparent hover:bg-white/[0.04] hover:border-[rgba(149,178,184,0.3)] transition-all cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className={cn("flex gap-3 mb-5", isxs ? "flex-col" : "flex-row items-start")}>
        {/* Search input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(237,242,239,0.35)]" />
          <input
            type="text"
            placeholder="Filter packages..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            aria-label="Filter packages"
            className="bg-transparent border border-[rgba(149,178,184,0.2)] rounded-lg pl-9 pr-3 py-2 text-sm text-[#EDF2EF] placeholder:text-[rgba(237,242,239,0.4)] focus:outline-none focus:border-[#4156E1] focus:ring-1 focus:ring-[#4156E1]/30 min-w-[220px] transition-all"
          />
          {filterText && (
            <button
              onClick={() => setFilterText("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-transparent text-[rgba(237,242,239,0.4)] hover:text-[#EDF2EF] cursor-pointer border-0 transition-colors"
              aria-label="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          {Object.entries(CATEGORIES).map(([key, { label, emoji }]) => {
            const count = categoryCounts[key] || 0;
            const isActive = category === key;

            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-[#4156E1]/20 border-[#4156E1]/40 text-[#EDF2EF] shadow-[0_0_12px_rgba(65,86,225,0.1)]"
                    : "bg-transparent border-[rgba(149,178,184,0.15)] text-[rgba(237,242,239,0.6)] hover:bg-white/[0.04] hover:border-[rgba(149,178,184,0.25)]"
                )}
              >
                <span className="text-xs">{emoji}</span>
                <span>{label}</span>
                <span
                  className={cn(
                    "text-[0.65rem] px-1.5 py-0 rounded-full ml-0.5 tabular-nums",
                    isActive
                      ? "bg-[#4156E1]/30 text-[rgba(237,242,239,0.8)]"
                      : "bg-white/[0.06] text-[rgba(237,242,239,0.4)]"
                  )}
                >
                  {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          aria-label="Sort packages"
          className="bg-[#161B22] border border-[rgba(149,178,184,0.2)] rounded-lg px-3 py-2 text-sm text-[#EDF2EF] focus:outline-none focus:border-[#4156E1] min-w-[140px] cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="alphabetical">A to Z</option>
        </select>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2">
        {visibleItems.map((item) => (
          <PkgCard key={item.project} {...item} />
        ))}
        {(loading || hasNextPage) &&
          Array.from({ length: isxs ? 2 : 4 }).map((_, index) => (
            <div key={`loader-${index}`} ref={index === 0 ? sentryRef : null}>
              <PkgCard isLoader />
            </div>
          ))}
        {error && (
          <div className="col-span-full">
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
              {error.message}
            </div>
          </div>
        )}

        {/* Enhanced empty state */}
        {!loading && processedItems.length === 0 && !error && (
          <div className="col-span-full">
            <div className="flex flex-col items-center py-12 px-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-[rgba(149,178,184,0.1)] flex items-center justify-center mb-5">
                <Package className="w-8 h-8 text-[rgba(237,242,239,0.2)]" />
              </div>

              <p className="text-base text-[rgba(237,242,239,0.7)] mb-1">
                {filterText
                  ? <>No packages found for "<span className="text-[#EDF2EF] font-medium">{filterText}</span>"</>
                  : "No packages match your filters"
                }
              </p>
              <p className="text-sm text-[rgba(237,242,239,0.4)] mb-6">
                Try adjusting your search or category
              </p>

              {/* Suggestions */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {POPULAR_SUGGESTIONS.map((s) => (
                    <a
                      key={s.project}
                      href={`/pkgs/${s.project}/`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-[rgba(149,178,184,0.15)] text-[rgba(237,242,239,0.6)] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[rgba(149,178,184,0.3)] transition-all no-underline"
                    >
                      {s.name}
                      <ArrowUpRight className="w-3 h-3 text-[rgba(237,242,239,0.3)]" />
                    </a>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#4156E1] hover:text-[#74FAD1] transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    Clear all filters
                  </button>
                  <span className="text-[rgba(237,242,239,0.2)]">|</span>
                  <a
                    href="https://github.com/pkgxdev/pantry/issues/new"
                    className="text-sm text-[rgba(237,242,239,0.5)] hover:text-[#4156E1] transition-colors no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Request a package &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface Package {
  name?: string;
  project?: string;
  birthtime?: string;
  description?: string;
  brief?: string;
  labels?: string[];
  isLoader?: boolean;
}

function useLoadAllItems() {
  const async_result = useAsync(async () => {
    const rsp = await fetch("https://pkgx.dev/pkgs/index.json");
    if (!rsp.ok) throw new Error(rsp.statusText);
    return (await rsp.json()) as Package[];
  });

  return {
    loading: async_result.loading,
    allItems: async_result.value ?? [],
    error: async_result.error,
  };
}

function PkgCard({ project, description, brief, name, labels, isLoader }: Package) {
  const isxs = useIsMobile();

  const chips = (labels ?? []).map((label) => (
    <span
      key={label}
      className="bg-[#F26212] text-[#0D1117] text-xs px-2 py-0.5 rounded-full font-medium inline-block"
      style={{ fontVariant: "small-caps" }}
    >
      {label}
    </span>
  ));

  return (
    <a
      href={project ? `/pkgs/${project}/` : "#"}
      className="group block rounded-lg border border-[rgba(149,178,184,0.12)] bg-[#0D1117] hover:border-[rgba(149,178,184,0.3)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 no-underline h-full"
    >
      {isLoader ? (
        <div className={cn("bg-white/5 animate-pulse rounded-t-lg", isxs ? "h-[150px]" : "aspect-square")} />
      ) : (
        <div
          className={cn("bg-cover bg-center text-right relative rounded-t-lg", isxs ? "h-[150px]" : "aspect-square")}
          style={{ backgroundImage: `url(/pkgs/${project}.webp)` }}
        >
          <div className={cn("flex flex-wrap justify-end gap-1", isxs ? "p-1" : "p-2")}>{chips}</div>
        </div>
      )}
      {isLoader ? (
        <div className={cn("p-2", isxs && "p-1")}>
          <div className="h-3 bg-white/10 rounded mb-1.5 animate-pulse" />
          <div className="h-3 bg-white/10 rounded w-4/5 animate-pulse" />
        </div>
      ) : (
        <div className={cn("p-2", isxs && "p-1")}>
          <h2 className="text-xs uppercase tracking-wider truncate group-hover:text-gradient transition-all">
            {name || get_pkg_name(project!)}
          </h2>
          <p className="text-xs text-[rgba(237,242,239,0.7)] line-clamp-2">{brief || description}</p>
        </div>
      )}
    </a>
  );
}
