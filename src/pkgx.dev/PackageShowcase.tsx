import useInfiniteScroll from "react-infinite-scroll-hook";
import { CSSProperties, useMemo, useState } from "react";
import { useIsMobile } from "../utils/useIsMobile";
import get_pkg_name from "../utils/pkg-name";
import { useAsync } from "react-use";
import { cn } from "../utils/cn";

const CATEGORIES: Record<string, { label: string; match: (pkg: Package) => boolean }> = {
  all: { label: "All", match: () => true },
  node: { label: "Node.js", match: (p) => p.labels?.includes("node") ?? false },
  python: { label: "Python", match: (p) => p.labels?.includes("python") ?? false },
  rust: { label: "Rust", match: (p) => p.labels?.includes("rust") ?? false },
  go: { label: "Go", match: (p) => p.labels?.includes("go") ?? false },
  ruby: { label: "Ruby", match: (p) => p.labels?.includes("ruby") ?? false },
};

type SortOption = "newest" | "oldest" | "alphabetical";

export default function Showcase() {
  const isxs = useIsMobile();
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterText, setFilterText] = useState("");

  const { loading, allItems, error } = useLoadAllItems();

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

  return (
    <>
      <h1 className={cn("text-xl", isxs && "text-center")}>
        Available Packages{" "}
        <span className="text-[rgba(237,242,239,0.7)] text-lg">
          {new Intl.NumberFormat().format(processedItems.length)}
        </span>
      </h1>

      {/* Filter Controls */}
      <div className={cn("flex gap-2 mb-4", isxs ? "flex-col" : "flex-row items-center")}>
        <input
          type="text"
          placeholder="Filter packages"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="bg-transparent border border-[rgba(149,178,184,0.3)] rounded px-3 py-1.5 text-sm text-[#EDF2EF] placeholder:text-[rgba(237,242,239,0.5)] focus:outline-none focus:border-[#4156E1] min-w-[200px]"
        />

        <div className="flex flex-wrap gap-0">
          {Object.entries(CATEGORIES).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={cn(
                "px-3 py-1.5 text-sm border border-[rgba(149,178,184,0.3)] transition-colors first:rounded-l last:rounded-r -ml-px first:ml-0",
                category === key
                  ? "bg-[#4156E1] border-[#4156E1] text-white"
                  : "bg-transparent text-[#EDF2EF] hover:bg-white/5"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-[#161B22] border border-[rgba(149,178,184,0.3)] rounded px-3 py-1.5 text-sm text-[#EDF2EF] focus:outline-none focus:border-[#4156E1] min-w-[140px]"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="alphabetical">A to Z</option>
        </select>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
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
            <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">
              {error.message}
            </div>
          </div>
        )}
        {!loading && processedItems.length === 0 && !error && (
          <div className="col-span-full">
            <p className="text-[rgba(237,242,239,0.7)] text-center py-4">
              No packages match your filters. Try adjusting your search or category.
            </p>
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
      className="block rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] hover:border-[rgba(149,178,184,0.5)] transition-all no-underline h-full"
    >
      {isLoader ? (
        <div className={cn("bg-white/5 animate-pulse", isxs ? "h-[150px]" : "aspect-square")} />
      ) : (
        <div
          className={cn("bg-cover bg-center text-right relative", isxs ? "h-[150px]" : "aspect-square")}
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
          <h3 className="text-xs uppercase tracking-wider truncate">
            {name || get_pkg_name(project!)}
          </h3>
          <p className="text-xs text-[rgba(237,242,239,0.7)]">{brief || description}</p>
        </div>
      )}
    </a>
  );
}
