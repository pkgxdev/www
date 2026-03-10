import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { isPlainObject } from "is-what";
import { cn } from "../../utils/cn";

interface DependencyGraphProps {
  dependencies: Record<string, string | Record<string, string>>;
  companions: Record<string, string>;
  project: string;
}

interface FlatDep {
  name: string;
  version: string;
  type: "runtime" | "build" | "companion";
}

function flattenDeps(
  deps: Record<string, string | Record<string, string>>,
  type: "runtime" | "build" = "runtime"
): FlatDep[] {
  const result: FlatDep[] = [];
  for (const [name, version] of Object.entries(deps)) {
    if (isPlainObject(version)) {
      for (const [subName, subVersion] of Object.entries(version as Record<string, string>)) {
        result.push({ name: subName, version: subVersion, type });
      }
    } else {
      result.push({ name, version: version as string, type });
    }
  }
  return result;
}

function formatVersion(version: string): string {
  if (version === "*") return "";
  if (/^\d/.test(version)) return `@${version}`;
  return version;
}

type ViewMode = "tree" | "list";

export default function DependencyGraph({
  dependencies,
  companions,
  project,
}: DependencyGraphProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [hoveredDep, setHoveredDep] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState<"all" | "runtime" | "companion">("all");

  const runtimeDeps = useMemo(() => flattenDeps(dependencies, "runtime"), [dependencies]);
  const companionDeps: FlatDep[] = useMemo(
    () =>
      Object.entries(companions).map(([name, version]) => ({
        name,
        version: version || "*",
        type: "companion" as const,
      })),
    [companions]
  );

  const allDeps = useMemo(() => [...runtimeDeps, ...companionDeps], [runtimeDeps, companionDeps]);
  const total = allDeps.length;

  const filteredDeps = useMemo(() => {
    if (showFilter === "all") return allDeps;
    if (showFilter === "runtime") return runtimeDeps;
    return companionDeps;
  }, [showFilter, allDeps, runtimeDeps, companionDeps]);

  const handleMouseEnter = useCallback((name: string) => setHoveredDep(name), []);
  const handleMouseLeave = useCallback(() => setHoveredDep(null), []);

  if (total === 0) return null;

  return (
    <div className="space-y-3" role="region" aria-label="Dependency graph">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[rgba(237,242,239,0.7)] uppercase tracking-wider">
          Dependencies
        </h4>
        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex gap-0" role="radiogroup" aria-label="Filter dependencies">
            {([
              { key: "all", label: `All (${total})` },
              { key: "runtime", label: `Runtime (${runtimeDeps.length})` },
              ...(companionDeps.length > 0
                ? [{ key: "companion", label: `Companion (${companionDeps.length})` }]
                : []),
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setShowFilter(key as typeof showFilter)}
                role="radio"
                aria-checked={showFilter === key}
                className={cn(
                  "px-2 py-0.5 text-[0.65rem] border transition-colors cursor-pointer bg-transparent first:rounded-l last:rounded-r -ml-px first:ml-0",
                  showFilter === key
                    ? "bg-[#4156E1]/20 text-[#4156E1] border-[#4156E1]/40"
                    : "text-[rgba(237,242,239,0.4)] border-[rgba(149,178,184,0.2)] hover:text-[rgba(237,242,239,0.6)]"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-0" role="radiogroup" aria-label="View mode">
            <button
              onClick={() => setViewMode("tree")}
              role="radio"
              aria-checked={viewMode === "tree"}
              className={cn(
                "px-2 py-0.5 text-[0.65rem] border rounded-l transition-colors cursor-pointer bg-transparent",
                viewMode === "tree"
                  ? "bg-[#4156E1]/20 text-[#4156E1] border-[#4156E1]/40"
                  : "text-[rgba(237,242,239,0.4)] border-[rgba(149,178,184,0.2)]"
              )}
              title="Tree view"
            >
              Tree
            </button>
            <button
              onClick={() => setViewMode("list")}
              role="radio"
              aria-checked={viewMode === "list"}
              className={cn(
                "px-2 py-0.5 text-[0.65rem] border -ml-px rounded-r transition-colors cursor-pointer bg-transparent",
                viewMode === "list"
                  ? "bg-[#4156E1]/20 text-[#4156E1] border-[#4156E1]/40"
                  : "text-[rgba(237,242,239,0.4)] border-[rgba(149,178,184,0.2)]"
              )}
              title="List view"
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] p-4">
        {viewMode === "tree" ? (
          <TreeView
            project={project}
            deps={filteredDeps}
            hoveredDep={hoveredDep}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ) : (
          <ListView
            deps={filteredDeps}
            hoveredDep={hoveredDep}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[0.65rem] text-[rgba(237,242,239,0.4)]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#4156E1] inline-block" /> Root
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[rgba(237,242,239,0.3)] inline-block" /> Runtime
        </span>
        {companionDeps.length > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F26212] inline-block" /> Companion
          </span>
        )}
      </div>
    </div>
  );
}

/** Tree view: visual hierarchy from root */
function TreeView({
  project,
  deps,
  hoveredDep,
  onMouseEnter,
  onMouseLeave,
}: {
  project: string;
  deps: FlatDep[];
  hoveredDep: string | null;
  onMouseEnter: (name: string) => void;
  onMouseLeave: () => void;
}) {
  return (
    <div role="tree" aria-label={`Dependency tree for ${project}`}>
      {/* Root node */}
      <div className="flex items-center gap-2 mb-3" role="treeitem" aria-level={1}>
        <div className="w-3.5 h-3.5 rounded-full bg-[#4156E1] shadow-[0_0_8px_rgba(65,86,225,0.4)] shrink-0" />
        <span className="font-mono text-sm font-semibold text-[#4156E1]">{project}</span>
        <span className="text-xs text-[rgba(237,242,239,0.4)]">
          {deps.length} {deps.length === 1 ? "dependency" : "dependencies"}
        </span>
      </div>

      {/* Dependencies */}
      <div className="ml-[7px] pl-4 border-l border-[rgba(149,178,184,0.2)] space-y-0.5" role="group">
        {deps.map(({ name, version, type }, i) => {
          const isCompanion = type === "companion";
          const isHovered = hoveredDep === name;
          const isLast = i === deps.length - 1;

          return (
            <div
              key={name}
              className={cn(
                "flex items-center gap-2 py-1 px-2 -ml-2 rounded-md transition-colors relative",
                isHovered ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
              )}
              onMouseEnter={() => onMouseEnter(name)}
              onMouseLeave={onMouseLeave}
              role="treeitem"
              aria-level={2}
            >
              {/* Branch connector */}
              <div
                className={cn(
                  "absolute -left-[0.88rem] w-3 border-b",
                  isCompanion ? "border-[#F26212]/40" : "border-[rgba(149,178,184,0.2)]"
                )}
                style={{ top: "50%" }}
              />

              {/* Dot */}
              <div
                className={cn(
                  "w-2 h-2 rounded-full shrink-0 transition-all",
                  isCompanion
                    ? "bg-[#F26212]"
                    : "bg-[rgba(237,242,239,0.3)]",
                  isHovered && "scale-150"
                )}
              />

              {/* Link */}
              <Link
                to={`/pkgs/${name}/`}
                className={cn(
                  "font-mono text-sm no-underline transition-colors",
                  isCompanion
                    ? "text-[#F26212] hover:text-[#EDF2EF]"
                    : "text-[#EDF2EF] hover:text-[#4156E1]"
                )}
              >
                {name}
                <span className="text-[rgba(237,242,239,0.4)]">{formatVersion(version)}</span>
              </Link>

              {/* Type badge */}
              {isCompanion && (
                <span className="text-[0.55rem] px-1 py-px rounded bg-[#F26212]/15 text-[#F26212] border border-[#F26212]/25">
                  companion
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** List view: compact sortable list */
function ListView({
  deps,
  hoveredDep,
  onMouseEnter,
  onMouseLeave,
}: {
  deps: FlatDep[];
  hoveredDep: string | null;
  onMouseEnter: (name: string) => void;
  onMouseLeave: () => void;
}) {
  return (
    <div role="list" aria-label="Dependency list" className="space-y-0.5">
      {/* Table header */}
      <div className="flex items-center gap-3 pb-2 mb-1 border-b border-[rgba(149,178,184,0.1)] text-[0.65rem] text-[rgba(237,242,239,0.4)] uppercase tracking-wider">
        <span className="flex-1">Package</span>
        <span className="w-24 text-right">Version</span>
        <span className="w-20 text-right">Type</span>
      </div>

      {deps.map(({ name, version, type }) => {
        const isHovered = hoveredDep === name;
        const isCompanion = type === "companion";

        return (
          <div
            key={name}
            role="listitem"
            className={cn(
              "flex items-center gap-3 py-1.5 px-2 -mx-2 rounded-md transition-colors",
              isHovered ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
            )}
            onMouseEnter={() => onMouseEnter(name)}
            onMouseLeave={onMouseLeave}
          >
            <Link
              to={`/pkgs/${name}/`}
              className={cn(
                "flex-1 font-mono text-sm no-underline transition-colors",
                isCompanion
                  ? "text-[#F26212] hover:text-[#EDF2EF]"
                  : "text-[#EDF2EF] hover:text-[#4156E1]"
              )}
            >
              {name}
            </Link>
            <span className="w-24 text-right font-mono text-xs text-[rgba(237,242,239,0.5)]">
              {version === "*" ? "any" : version}
            </span>
            <span
              className={cn(
                "w-20 text-right text-[0.65rem]",
                isCompanion ? "text-[#F26212]" : "text-[rgba(237,242,239,0.4)]"
              )}
            >
              {type}
            </span>
          </div>
        );
      })}
    </div>
  );
}
