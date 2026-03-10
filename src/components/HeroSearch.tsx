import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

const MAX_RESULTS = 10;

interface PkgEntry {
  project: string;
  name?: string;
  description?: string;
  labels?: string[];
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
      else if (project.split("/").pop()?.startsWith(q) || project.split(".").some((seg) => seg.startsWith(q))) score += 30;
      else if (project.includes(q) || name.includes(q)) score += 20;
      else if (desc.includes(q)) score += 5;
      else return null;
      return { pkg, score };
    })
    .filter(Boolean) as { pkg: PkgEntry; score: number }[];
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_RESULTS).map((s) => s.pkg);
}

export default function HeroSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const [isopen, setopen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PkgEntry[]>([]);
  const [packages, setPackages] = useState<PkgEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    loadPkgIndex().then(setPackages).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popperRef.current && !popperRef.current.contains(e.target as Node) && e.target !== inputRef.current) {
        setopen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        window.location.href = `/pkgs/${items[selectedIndex].project}/`;
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

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4156E1] via-[#74FAD1] to-[#F26212] rounded-2xl opacity-0 group-focus-within:opacity-30 blur-md transition-opacity duration-500" />
        <input
          ref={inputRef}
          type="search" role="searchbox" aria-label="Search packages"
          placeholder="Search 13,000+ packages..."
          value={query}
          onFocus={() => setopen(true)}
          onChange={(e) => handleSearch(e.target.value)}
          className={cn(
            "relative w-full bg-[#0D1117]/90 backdrop-blur-xl",
            "border border-[rgba(149,178,184,0.2)] rounded-2xl",
            "px-6 py-4 text-lg text-[#EDF2EF]",
            "placeholder:text-[rgba(237,242,239,0.4)]",
            "focus:outline-none focus:border-[#4156E1]/50 focus:ring-2 focus:ring-[#4156E1]/20",
            "transition-all duration-300"
          )}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs text-[rgba(237,242,239,0.4)] bg-[rgba(149,178,184,0.1)] rounded-md border border-[rgba(149,178,184,0.15)]">
            <span className="text-[0.65rem]">&#8984;</span>K
          </kbd>
        </div>
      </div>

      {isopen && query.trim() && (
        <div
          ref={popperRef}
          className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#161B22]/95 backdrop-blur-xl border border-[rgba(149,178,184,0.2)] rounded-xl shadow-2xl max-h-[400px] overflow-auto animate-fade-in"
        >
          {results.length === 0 ? (
            <div className="p-6 text-center text-[rgba(237,242,239,0.5)]">No packages found for "{query}"</div>
          ) : (
            <ul className="list-none p-2 m-0">
              {results.map((pkg, index) => (
                <li key={pkg.project}>
                  <a
                    href={`/pkgs/${pkg.project}/`}
                    className={cn(
                      "block px-4 py-3 rounded-lg no-underline transition-all duration-150",
                      index === selectedIndex ? "bg-[#4156E1]/20 border border-[#4156E1]/30" : "hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#EDF2EF]">{pkg.name || pkg.project}</span>
                      {(pkg.labels || []).slice(0, 2).map((l) => (
                        <span key={l} className="text-[0.6rem] px-1.5 py-0.5 bg-[#4156E1]/15 text-[#74FAD1] rounded-full">{l}</span>
                      ))}
                    </div>
                    {pkg.description && (
                      <p className="text-xs text-[rgba(237,242,239,0.5)] mt-0.5 truncate">{pkg.description}</p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
