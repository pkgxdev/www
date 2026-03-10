import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useIsMobile } from "../utils/useIsMobile";
import { cn } from "../utils/cn";
import { Clock, Package, TrendingUp, Search as SearchIcon } from "lucide-react";

const RECENT_SEARCHES_KEY = "pkgx_recent_searches";
const MAX_RECENT = 5;
const MAX_RESULTS = 15;

const POPULAR_PACKAGES = ["python.org", "nodejs.org", "rust-lang.org", "go.dev", "deno.land", "bun.sh"];
const PLACEHOLDER_SUGGESTIONS = ["python", "node", "rust", "go", "docker", "git"];

interface PkgEntry {
  project: string;
  name?: string;
  description?: string;
  labels?: string[];
}

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  try {
    const existing = getRecentSearches().filter((s) => s !== query);
    existing.unshift(query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(existing.slice(0, MAX_RECENT)));
  } catch {
    // localStorage unavailable
  }
}

let pkgCache: PkgEntry[] | null = null;

async function loadPkgIndex(): Promise<PkgEntry[]> {
  if (pkgCache) return pkgCache;
  const rsp = await fetch("https://pkgx.dev/pkgs/index.json");
  if (!rsp.ok) throw new Error(rsp.statusText);
  pkgCache = (await rsp.json()) as PkgEntry[];
  return pkgCache;
}

/**
 * Enhanced fuzzy search with multi-factor scoring.
 * Factors: exact match (100), starts-with (50), segment match (30),
 * substring (20), description (5), plus popularity bonus.
 */
function fuzzyMatch(text: string, query: string): number {
  if (!text || !query) return 0;
  const t = text.toLowerCase();
  const q = query.toLowerCase();

  if (t === q) return 100;
  if (t.startsWith(q)) return 50;

  // Check if any segment starts with query
  const segments = t.split(/[-_.\s/]/);
  if (segments.some((seg) => seg.startsWith(q))) return 30;

  if (t.includes(q)) return 20;

  // Fuzzy: check if all characters appear in order
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  if (qi === q.length) return 8;

  return 0;
}

function searchPackages(query: string, packages: PkgEntry[]): PkgEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored = packages
    .map((pkg) => {
      const project = pkg.project.toLowerCase();
      const name = (pkg.name || "").toLowerCase();
      const desc = (pkg.description || "").toLowerCase();

      // Take best score from project or name
      const projectScore = fuzzyMatch(project, q);
      const nameScore = fuzzyMatch(name, q);
      let score = Math.max(projectScore, nameScore);

      // Description fallback
      if (score === 0 && desc.includes(q)) score = 5;

      if (score === 0) return null;

      // Popularity bonus
      if (POPULAR_PACKAGES.includes(pkg.project)) score += 8;

      return { pkg, score };
    })
    .filter(Boolean) as { pkg: PkgEntry; score: number }[];

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_RESULTS).map((s) => s.pkg);
}

export default function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const [isopen, setopen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PkgEntry[]>([]);
  const [packages, setPackages] = useState<PkgEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches());
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const isxs = useIsMobile();
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const shortcut_txt = isMac ? "⌘K" : "Ctrl+K";

  // Cycle placeholder text
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const placeholderText = `Try: ${PLACEHOLDER_SUGGESTIONS[placeholderIndex]}`;

  // Popular packages with info
  const popularWithInfo = useMemo(() => {
    return POPULAR_PACKAGES.map((project) => {
      const pkg = packages.find((p) => p.project === project);
      return pkg || { project, name: project };
    });
  }, [packages]);

  // Load package index on mount
  useEffect(() => {
    loadPkgIndex().then(setPackages).catch(() => {});
  }, []);

  // Cmd+K handler (delegates to CommandPalette if present, otherwise focuses this)
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        // CommandPalette handles ⌘K globally; only fallback here if no palette
        // This is kept as backup for accessibility
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popperRef.current &&
        !popperRef.current.contains(e.target as Node) &&
        e.target !== inputRef.current
      ) {
        setopen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!isopen) return;
      const itemCount = query ? results.length : recentSearches.length + popularWithInfo.length;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, itemCount - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, -1));
      } else if (event.key === "Enter" && selectedIndex >= 0) {
        event.preventDefault();
        if (query && selectedIndex < results.length) {
          const pkg = results[selectedIndex];
          saveRecentSearch(query);
          window.location.href = `/pkgs/${pkg.project}/`;
        } else if (!query) {
          // Navigate recent or popular
          if (selectedIndex < recentSearches.length) {
            const term = recentSearches[selectedIndex];
            setQuery(term);
            handleSearchImmediate(term);
          } else {
            const popIdx = selectedIndex - recentSearches.length;
            if (popIdx < popularWithInfo.length) {
              const pkg = popularWithInfo[popIdx];
              window.location.href = `/pkgs/${pkg.project}/`;
            }
          }
        }
      } else if (event.key === "Escape") {
        inputRef.current?.blur();
        setopen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isopen, query, results, selectedIndex, recentSearches, popularWithInfo]);

  const handleSearchImmediate = useCallback(
    (value: string) => {
      if (value.trim()) {
        setResults(searchPackages(value, packages));
      } else {
        setResults([]);
      }
    },
    [packages]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setSelectedIndex(-1);
      // Debounce search for performance (50ms)
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        handleSearchImmediate(value);
      }, 50);
      setDebounceTimer(timer);
    },
    [packages, debounceTimer, handleSearchImmediate]
  );

  const handleResultClick = (project: string) => {
    if (query) saveRecentSearch(query);
    setRecentSearches(getRecentSearches());
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    handleSearchImmediate(term);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          placeholder={isopen ? placeholderText : "Search packages"}
          value={query}
          onFocus={() => {
            setopen(true);
            setRecentSearches(getRecentSearches());
          }}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Search packages"
          aria-expanded={isopen}
          aria-controls="search-dropdown"
          aria-autocomplete="list"
          role="combobox"
          className={cn(
            "bg-transparent border border-[rgba(149,178,184,0.3)] rounded px-3 py-1.5 text-sm",
            "text-[#EDF2EF] placeholder:text-[rgba(237,242,239,0.5)]",
            "focus:outline-none focus:border-[#4156E1] focus:ring-1 focus:ring-[#4156E1]",
            "transition-colors w-48 md:w-56"
          )}
        />
        {!isxs && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[rgba(237,242,239,0.5)]">
            {shortcut_txt}
          </span>
        )}
      </div>

      {isopen && (
        <div
          ref={popperRef}
          id="search-dropdown"
          role="listbox"
          className={cn(
            "absolute right-0 top-full mt-1 z-50",
            "bg-[#161B22]/95 backdrop-blur-xl border border-[rgba(149,178,184,0.2)] rounded-xl shadow-2xl",
            "max-h-[420px] overflow-auto min-w-[340px]",
            "animate-fade-in"
          )}
        >
          {query.trim() ? (
            <SearchResults
              query={query}
              results={results}
              selectedIndex={selectedIndex}
              onClick={handleResultClick}
            />
          ) : (
            <DefaultDropdown
              recentSearches={recentSearches}
              popularPackages={popularWithInfo}
              selectedIndex={selectedIndex}
              onRecentClick={handleRecentClick}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SearchResults({
  query,
  results,
  selectedIndex,
  onClick,
}: {
  query: string;
  results: PkgEntry[];
  selectedIndex: number;
  onClick: (project: string) => void;
}) {
  if (results.length === 0) {
    return (
      <div className="p-5 text-center">
        <Package className="w-8 h-8 text-[rgba(237,242,239,0.2)] mx-auto mb-2" />
        <p className="text-sm text-[rgba(237,242,239,0.6)] mb-1">
          No packages found for "<span className="text-[#EDF2EF]">{query}</span>"
        </p>
        <p className="text-xs text-[rgba(237,242,239,0.35)] mb-3">
          Try: {PLACEHOLDER_SUGGESTIONS.slice(0, 4).join(", ")}
        </p>
        <a
          href="https://github.com/pkgxdev/pantry/issues/new"
          className="text-xs text-[#4156E1] hover:text-[#74FAD1] transition-colors no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Request a package &rarr;
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="px-3 py-2">
        <span className="text-[0.65rem] uppercase tracking-[0.1em] text-[rgba(237,242,239,0.35)]">
          {results.length} result{results.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="list-none p-0 m-0 pb-1" role="listbox">
        {results.map((pkg, index) => {
          const { project, name, description, labels } = pkg;
          const displayName = name || project;

          return (
            <li key={project} role="option" aria-selected={index === selectedIndex}>
              <a
                href={`/pkgs/${project}/`}
                onClick={() => onClick(project)}
                className={cn(
                  "flex items-center gap-3 mx-1.5 px-3 py-2.5 rounded-lg no-underline transition-all duration-100",
                  index === selectedIndex
                    ? "bg-[#4156E1]/15 border border-[#4156E1]/25"
                    : "border border-transparent hover:bg-white/[0.04]"
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                    index === selectedIndex
                      ? "bg-[#4156E1]/20 text-[#74FAD1]"
                      : "bg-white/[0.04] text-[rgba(237,242,239,0.35)]"
                  )}
                >
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#EDF2EF] font-medium">{displayName}</span>
                    {(labels || []).slice(0, 2).map((l) => (
                      <span
                        key={l}
                        className="text-[0.6rem] px-1.5 py-0.5 bg-[#4156E1]/10 text-[rgba(237,242,239,0.5)] rounded-full"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {name && name !== project && (
                      <span className="text-xs text-[rgba(237,242,239,0.35)]">{project}</span>
                    )}
                    {description && (
                      <span className="text-xs text-[rgba(237,242,239,0.4)] truncate">
                        {name && name !== project ? " \u2014 " : ""}
                        {description}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DefaultDropdown({
  recentSearches,
  popularPackages,
  selectedIndex,
  onRecentClick,
}: {
  recentSearches: string[];
  popularPackages: PkgEntry[];
  selectedIndex: number;
  onRecentClick: (term: string) => void;
}) {
  let flatIndex = -1;

  return (
    <div className="py-1">
      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="mb-1">
          <div className="px-3 py-1.5">
            <span className="text-[0.65rem] uppercase tracking-[0.1em] text-[rgba(237,242,239,0.35)]">
              Recent
            </span>
          </div>
          <ul className="list-none p-0 m-0">
            {recentSearches.map((term) => {
              flatIndex++;
              const idx = flatIndex;
              return (
                <li key={term}>
                  <button
                    onClick={() => onRecentClick(term)}
                    className={cn(
                      "w-full flex items-center gap-2.5 mx-1.5 px-3 py-2 rounded-lg text-left transition-all duration-100 bg-transparent border cursor-pointer",
                      "text-sm text-[#EDF2EF]",
                      idx === selectedIndex
                        ? "bg-[#4156E1]/15 border-[#4156E1]/25"
                        : "border-transparent hover:bg-white/[0.04]"
                    )}
                    style={{ width: "calc(100% - 12px)" }}
                  >
                    <Clock className="w-3.5 h-3.5 text-[rgba(237,242,239,0.3)] shrink-0" />
                    {term}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Popular packages */}
      <div>
        <div className="px-3 py-1.5">
          <span className="text-[0.65rem] uppercase tracking-[0.1em] text-[rgba(237,242,239,0.35)]">
            Popular
          </span>
        </div>
        <ul className="list-none p-0 m-0 pb-1">
          {popularPackages.map((pkg) => {
            flatIndex++;
            const idx = flatIndex;
            return (
              <li key={pkg.project}>
                <a
                  href={`/pkgs/${pkg.project}/`}
                  className={cn(
                    "flex items-center gap-2.5 mx-1.5 px-3 py-2 rounded-lg no-underline transition-all duration-100",
                    "text-sm text-[#EDF2EF]",
                    idx === selectedIndex
                      ? "bg-[#4156E1]/15 border border-[#4156E1]/25"
                      : "border border-transparent hover:bg-white/[0.04]"
                  )}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[rgba(237,242,239,0.3)] shrink-0" />
                  <span>{pkg.name || pkg.project}</span>
                  {pkg.description && (
                    <span className="text-xs text-[rgba(237,242,239,0.3)] truncate ml-auto">
                      {pkg.description}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
