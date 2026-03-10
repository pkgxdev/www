import { useCallback, useEffect, useRef, useState } from "react";
import { useIsMobile } from "../utils/useIsMobile";
import { cn } from "../utils/cn";

const RECENT_SEARCHES_KEY = "pkgx_recent_searches";
const MAX_RECENT = 5;
const MAX_RESULTS = 15;

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

function searchPackages(query: string, packages: PkgEntry[]): PkgEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored = packages
    .map((pkg) => {
      const project = pkg.project.toLowerCase();
      const name = (pkg.name || "").toLowerCase();
      const desc = (pkg.description || "").toLowerCase();

      let score = 0;
      if (project === q || name === q) score += 100;
      else if (project.startsWith(q) || name.startsWith(q)) score += 50;
      else if (
        project.split("/").pop()?.startsWith(q) ||
        project.split(".").some((seg) => seg.startsWith(q))
      )
        score += 30;
      else if (project.includes(q) || name.includes(q)) score += 20;
      else if (desc.includes(q)) score += 5;
      else return null;

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

  const isxs = useIsMobile();
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const shortcut_txt = isMac ? "⌘K" : "Ctrl+K";

  // Load package index on mount
  useEffect(() => {
    loadPkgIndex().then(setPackages).catch(() => {});
  }, []);

  // Cmd+K handler
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
        } else {
          inputRef.current?.blur();
        }
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
      const items = query ? results : [];

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, -1));
      } else if (event.key === "Enter" && selectedIndex >= 0 && selectedIndex < items.length) {
        event.preventDefault();
        const pkg = items[selectedIndex];
        saveRecentSearch(query);
        window.location.href = `/pkgs/${pkg.project}/`;
      } else if (event.key === "Escape") {
        inputRef.current?.blur();
        setopen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isopen, query, results, selectedIndex]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setSelectedIndex(-1);
      if (value.trim()) {
        setResults(searchPackages(value, packages));
      } else {
        setResults([]);
      }
    },
    [packages]
  );

  const handleResultClick = (project: string) => {
    if (query) saveRecentSearch(query);
    setRecentSearches(getRecentSearches());
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    handleSearch(term);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search packages"
          value={query}
          onFocus={() => setopen(true)}
          onChange={(e) => handleSearch(e.target.value)}
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
          className={cn(
            "absolute right-0 top-full mt-1 z-50",
            "bg-[#161B22] border border-[rgba(149,178,184,0.3)] rounded-lg shadow-2xl",
            "max-h-[400px] overflow-auto min-w-[320px]",
            "animate-fade-in"
          )}
        >
          {query.trim() ? (
            <SearchResults results={results} selectedIndex={selectedIndex} onClick={handleResultClick} />
          ) : recentSearches.length > 0 ? (
            <RecentSearches searches={recentSearches} onSelect={handleRecentClick} />
          ) : null}
        </div>
      )}
    </div>
  );
}

function SearchResults({
  results,
  selectedIndex,
  onClick,
}: {
  results: PkgEntry[];
  selectedIndex: number;
  onClick: (project: string) => void;
}) {
  if (results.length === 0) {
    return (
      <div className="p-4">
        <p className="text-[rgba(237,242,239,0.7)]">No packages found</p>
      </div>
    );
  }

  return (
    <ul className="list-none p-0 m-0">
      {results.map((pkg, index) => {
        const { project, name, description, labels } = pkg;
        const displayName = name || project;

        return (
          <li key={project}>
            <a
              href={`/pkgs/${project}/`}
              onClick={() => onClick(project)}
              className={cn(
                "block px-3 py-2 no-underline transition-colors",
                index === selectedIndex ? "bg-white/10" : "hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#EDF2EF]">{displayName}</span>
                {(labels || []).map((l) => (
                  <span
                    key={l}
                    className="text-[0.65rem] px-1.5 py-0 border border-[rgba(149,178,184,0.3)] rounded-full text-[rgba(237,242,239,0.7)]"
                  >
                    {l}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {name && name !== project && (
                  <span className="text-xs text-[rgba(237,242,239,0.5)]">{project}</span>
                )}
                {description && (
                  <span className="text-xs text-[rgba(237,242,239,0.5)]">
                    {name && name !== project ? " — " : ""}
                    {description}
                  </span>
                )}
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function RecentSearches({
  searches,
  onSelect,
}: {
  searches: string[];
  onSelect: (term: string) => void;
}) {
  return (
    <div className="p-2">
      <p className="text-xs text-[rgba(237,242,239,0.5)] px-2">Recent searches</p>
      <ul className="list-none p-0 m-0 mt-1">
        {searches.map((term) => (
          <li key={term}>
            <button
              onClick={() => onSelect(term)}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-white/5 rounded transition-colors bg-transparent border-0 text-[#EDF2EF] cursor-pointer"
            >
              {term}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
