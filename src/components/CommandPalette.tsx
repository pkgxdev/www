import { useCallback, useEffect, useRef, useState, useMemo, Fragment } from "react";
import { cn } from "../utils/cn";
import { Search, ArrowUp, ArrowDown, CornerDownLeft, X, Clock, TrendingUp, Package, Command } from "lucide-react";

const RECENT_SEARCHES_KEY = "pkgx_recent_searches";
const MAX_RECENT = 5;
const MAX_RESULTS = 10;

const POPULAR_PACKAGES = [
  "python.org",
  "nodejs.org",
  "rust-lang.org",
  "go.dev",
  "ruby-lang.org",
  "deno.land",
  "bun.sh",
  "docker.com",
];

interface PkgEntry {
  project: string;
  name?: string;
  description?: string;
  labels?: string[];
}

interface CommandAction {
  id: string;
  label: string;
  description?: string;
  icon: typeof Package;
  action: () => void;
  category: "navigation" | "package";
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

function scorePackage(pkg: PkgEntry, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const project = pkg.project.toLowerCase();
  const name = (pkg.name || "").toLowerCase();
  const desc = (pkg.description || "").toLowerCase();

  let score = 0;

  // Exact match
  if (project === q || name === q) score += 100;
  // Starts with
  else if (project.startsWith(q) || name.startsWith(q)) score += 50;
  // Segment starts with (e.g., "node" matches "nodejs.org")
  else if (
    project.split("/").pop()?.startsWith(q) ||
    project.split(".").some((seg) => seg.startsWith(q)) ||
    name.split(/[-_\s]/).some((seg) => seg.startsWith(q))
  )
    score += 30;
  // Contains
  else if (project.includes(q) || name.includes(q)) score += 20;
  // Description match
  else if (desc.includes(q)) score += 5;
  // No match
  else return 0;

  // Popularity bonus: popular packages get a small boost
  if (POPULAR_PACKAGES.includes(pkg.project)) score += 8;

  return score;
}

function searchPackages(query: string, packages: PkgEntry[]): PkgEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored = packages
    .map((pkg) => {
      const score = scorePackage(pkg, q);
      if (score === 0) return null;
      return { pkg, score };
    })
    .filter(Boolean) as { pkg: PkgEntry; score: number }[];

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_RESULTS).map((s) => s.pkg);
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [packages, setPackages] = useState<PkgEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  // Load package index
  useEffect(() => {
    loadPkgIndex().then(setPackages).catch(() => {});
  }, []);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      // Small delay for animation
      requestAnimationFrame(() => inputRef.current?.focus());
      setQuery("");
      setSelectedIndex(0);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Build items list
  const recentSearches = useMemo(() => getRecentSearches(), [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchPackages(query, packages);
  }, [query, packages]);

  // Build the display sections
  const sections = useMemo(() => {
    if (query.trim()) {
      if (results.length === 0) return [];
      return [
        {
          title: "Packages",
          items: results.map((pkg) => ({
            id: `pkg-${pkg.project}`,
            label: pkg.name || pkg.project,
            description: pkg.description,
            sublabel: pkg.name && pkg.name !== pkg.project ? pkg.project : undefined,
            labels: pkg.labels,
            icon: "package" as const,
            href: `/pkgs/${pkg.project}/`,
          })),
        },
      ];
    }

    // Default state: recent + popular
    const sects: {
      title: string;
      items: {
        id: string;
        label: string;
        description?: string;
        sublabel?: string;
        labels?: string[];
        icon: "recent" | "popular" | "package";
        href: string;
      }[];
    }[] = [];

    if (recentSearches.length > 0) {
      sects.push({
        title: "Recent",
        items: recentSearches.map((term) => ({
          id: `recent-${term}`,
          label: term,
          icon: "recent" as const,
          href: "#",
        })),
      });
    }

    sects.push({
      title: "Popular",
      items: POPULAR_PACKAGES.slice(0, 6).map((project) => {
        const pkg = packages.find((p) => p.project === project);
        return {
          id: `popular-${project}`,
          label: pkg?.name || project,
          description: pkg?.description,
          icon: "popular" as const,
          href: `/pkgs/${project}/`,
        };
      }),
    });

    return sects;
  }, [query, results, recentSearches, packages]);

  // Flatten items for keyboard navigation
  const flatItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < flatItems.length) {
        e.preventDefault();
        const item = flatItems[selectedIndex];
        if (item.icon === "recent") {
          // Re-search with the recent term
          setQuery(item.label);
        } else {
          if (query.trim()) saveRecentSearch(query.trim());
          setIsOpen(false);
          window.location.href = item.href;
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, selectedIndex, flatItems, query]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) {
        setIsOpen(false);
      }
    },
    []
  );

  if (!isOpen) return null;

  let flatIndex = -1;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0A0711]/80 backdrop-blur-sm animate-cmd-backdrop" />

      {/* Dialog */}
      <div className="relative w-full max-w-[600px] animate-cmd-dialog">
        <div className="bg-[#161B22]/95 backdrop-blur-xl border border-[rgba(149,178,184,0.2)] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 border-b border-[rgba(149,178,184,0.1)]">
            <Search className="w-5 h-5 text-[rgba(237,242,239,0.4)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search packages, commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 py-4 text-base text-[#EDF2EF] placeholder:text-[rgba(237,242,239,0.35)] focus:outline-none"
              aria-label="Search packages"
              aria-activedescendant={flatItems[selectedIndex]?.id}
              role="combobox"
              aria-expanded="true"
              aria-controls="command-palette-list"
              aria-autocomplete="list"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-transparent border border-[rgba(149,178,184,0.15)] text-[rgba(237,242,239,0.4)] hover:text-[#EDF2EF] hover:border-[rgba(149,178,184,0.3)] transition-colors cursor-pointer"
              aria-label="Close command palette"
            >
              <span className="text-xs font-mono px-0.5">ESC</span>
            </button>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            id="command-palette-list"
            role="listbox"
            className="max-h-[360px] overflow-y-auto py-2"
          >
            {query.trim() && results.length === 0 ? (
              <EmptyState query={query} />
            ) : (
              sections.map((section) => (
                <div key={section.title} className="mb-1 last:mb-0">
                  <div className="px-4 py-1.5">
                    <span className="text-[0.65rem] uppercase tracking-[0.15em] text-[rgba(237,242,239,0.35)] font-medium">
                      {section.title}
                    </span>
                  </div>
                  {section.items.map((item) => {
                    flatIndex++;
                    const idx = flatIndex;
                    const isSelected = idx === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        data-index={idx}
                        id={item.id}
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => {
                          if (item.icon === "recent") {
                            setQuery(item.label);
                          } else {
                            if (query.trim()) saveRecentSearch(query.trim());
                            setIsOpen(false);
                            window.location.href = item.href;
                          }
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-100",
                          isSelected
                            ? "bg-[#4156E1]/15 border border-[#4156E1]/25"
                            : "border border-transparent hover:bg-white/[0.03]"
                        )}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            isSelected
                              ? "bg-[#4156E1]/20 text-[#74FAD1]"
                              : "bg-white/[0.04] text-[rgba(237,242,239,0.4)]"
                          )}
                        >
                          {item.icon === "recent" ? (
                            <Clock className="w-4 h-4" />
                          ) : item.icon === "popular" ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <Package className="w-4 h-4" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#EDF2EF] font-medium truncate">
                              {item.label}
                            </span>
                            {item.sublabel && (
                              <span className="text-xs text-[rgba(237,242,239,0.35)] truncate">
                                {item.sublabel}
                              </span>
                            )}
                            {(item.labels || []).slice(0, 2).map((l) => (
                              <span
                                key={l}
                                className="text-[0.55rem] px-1.5 py-0.5 bg-[#4156E1]/10 text-[rgba(237,242,239,0.5)] rounded-full"
                              >
                                {l}
                              </span>
                            ))}
                          </div>
                          {item.description && (
                            <p className="text-xs text-[rgba(237,242,239,0.4)] mt-0.5 truncate">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Selection indicator */}
                        {isSelected && (
                          <CornerDownLeft className="w-4 h-4 text-[rgba(237,242,239,0.3)] shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer with keyboard hints */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[rgba(149,178,184,0.08)] bg-[rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-1.5 text-[0.65rem] text-[rgba(237,242,239,0.3)]">
              <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-white/[0.06] border border-[rgba(149,178,184,0.12)]">
                <ArrowUp className="w-3 h-3" />
              </kbd>
              <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-white/[0.06] border border-[rgba(149,178,184,0.12)]">
                <ArrowDown className="w-3 h-3" />
              </kbd>
              <span className="ml-0.5">Navigate</span>
            </div>
            <div className="flex items-center gap-1.5 text-[0.65rem] text-[rgba(237,242,239,0.3)]">
              <kbd className="inline-flex items-center justify-center h-5 px-1.5 rounded bg-white/[0.06] border border-[rgba(149,178,184,0.12)] text-[0.6rem]">
                Enter
              </kbd>
              <span className="ml-0.5">Select</span>
            </div>
            <div className="flex items-center gap-1.5 text-[0.65rem] text-[rgba(237,242,239,0.3)]">
              <kbd className="inline-flex items-center justify-center h-5 px-1.5 rounded bg-white/[0.06] border border-[rgba(149,178,184,0.12)] text-[0.6rem]">
                Esc
              </kbd>
              <span className="ml-0.5">Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  const suggestions = ["python", "node", "rust", "go", "docker", "git"];

  return (
    <div className="py-8 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-[rgba(149,178,184,0.1)] flex items-center justify-center mx-auto mb-4">
        <Package className="w-6 h-6 text-[rgba(237,242,239,0.25)]" />
      </div>
      <p className="text-sm text-[rgba(237,242,239,0.6)] mb-1">
        No packages found for "<span className="text-[#EDF2EF]">{query}</span>"
      </p>
      <p className="text-xs text-[rgba(237,242,239,0.35)] mb-4">
        Try a different search term
      </p>

      {/* Suggestions */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {suggestions.map((s) => (
          <span
            key={s}
            className="text-xs px-3 py-1 rounded-full border border-[rgba(149,178,184,0.15)] text-[rgba(237,242,239,0.5)] bg-white/[0.02] cursor-default"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Request link */}
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
