import { useState, useMemo, useCallback } from "react";
import { cn } from "../../utils/cn";

interface VersionTimelineProps {
  versions: string[];
  project: string;
}

type VersionType = "major" | "minor" | "patch";

interface ParsedVersion {
  raw: string;
  type: VersionType;
  major: number;
  minor: number;
  patch: number;
}

function parseVersion(version: string): ParsedVersion {
  const parts = version.split(".").map(Number);
  const major = parts[0] ?? 0;
  const minor = parts[1] ?? 0;
  const patch = parts[2] ?? 0;

  let type: VersionType = "patch";
  if (parts.length >= 3 && patch === 0 && minor === 0) type = "major";
  else if (parts.length >= 2 && (patch === 0 || parts.length === 2)) type = "minor";

  return { raw: version, type, major, minor, patch };
}

const TYPE_STYLES: Record<VersionType, { dot: string; text: string; label: string; labelStyle: string }> = {
  major: {
    dot: "w-3.5 h-3.5 bg-[#F26212] border-[#F26212] shadow-[0_0_8px_rgba(242,98,18,0.4)]",
    text: "text-[#EDF2EF] font-semibold",
    label: "major",
    labelStyle: "bg-[#F26212]/20 text-[#F26212] border-[#F26212]/30",
  },
  minor: {
    dot: "w-3 h-3 bg-[#74FAD1] border-[#74FAD1]",
    text: "text-[rgba(237,242,239,0.8)]",
    label: "minor",
    labelStyle: "bg-[#74FAD1]/15 text-[#74FAD1] border-[#74FAD1]/30",
  },
  patch: {
    dot: "w-2.5 h-2.5 bg-transparent border-[rgba(149,178,184,0.4)]",
    text: "text-[rgba(237,242,239,0.5)]",
    label: "patch",
    labelStyle: "bg-white/5 text-[rgba(237,242,239,0.4)] border-white/10",
  },
};

const INITIAL_SHOW = 10;
const EXPAND_INCREMENT = 20;

export default function VersionTimeline({ versions, project }: VersionTimelineProps) {
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [filter, setFilter] = useState<VersionType | "all">("all");

  const parsed = useMemo(
    () => versions.filter((v) => v.trim()).map(parseVersion),
    [versions]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return parsed;
    return parsed.filter((v) => v.type === filter);
  }, [parsed, filter]);

  const visible = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;

  const handleShowMore = useCallback(() => {
    setShowCount((c) => Math.min(c + EXPAND_INCREMENT, filtered.length));
  }, [filtered.length]);

  const handleVersionClick = useCallback((version: string) => {
    setSelectedVersion((prev) => (prev === version ? null : version));
  }, []);

  if (parsed.length === 0) return null;

  const majorCount = parsed.filter((v) => v.type === "major").length;
  const minorCount = parsed.filter((v) => v.type === "minor").length;
  const patchCount = parsed.filter((v) => v.type === "patch").length;

  return (
    <div className="space-y-3" role="region" aria-label="Version timeline">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[rgba(237,242,239,0.7)] uppercase tracking-wider">
          Version Timeline
        </h4>
        <span className="text-xs text-[rgba(237,242,239,0.4)]">
          {parsed.length} version{parsed.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Filter by version type">
        {([
          { key: "all", label: `All (${parsed.length})` },
          { key: "major", label: `Major (${majorCount})` },
          { key: "minor", label: `Minor (${minorCount})` },
          { key: "patch", label: `Patch (${patchCount})` },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setFilter(key); setShowCount(INITIAL_SHOW); }}
            role="radio"
            aria-checked={filter === key}
            className={cn(
              "px-2 py-0.5 text-xs rounded-full border transition-colors cursor-pointer bg-transparent",
              filter === key
                ? "bg-[#4156E1]/20 text-[#4156E1] border-[#4156E1]/40"
                : "text-[rgba(237,242,239,0.5)] border-[rgba(149,178,184,0.2)] hover:border-[rgba(149,178,184,0.4)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div
        className="relative pl-5 border-l-2 border-[rgba(149,178,184,0.15)] space-y-0.5"
        role="list"
        aria-label="Version list"
      >
        {visible.map((v, i) => {
          const isLatest = i === 0 && filter === "all";
          const isSelected = selectedVersion === v.raw;
          const style = isLatest
            ? {
                dot: "w-4 h-4 bg-[#4156E1] border-[#4156E1] shadow-[0_0_10px_rgba(65,86,225,0.5)]",
                text: "text-[#4156E1] font-bold",
              }
            : TYPE_STYLES[v.type];

          return (
            <div key={v.raw} role="listitem">
              <button
                onClick={() => handleVersionClick(v.raw)}
                className={cn(
                  "relative flex items-center gap-3 py-1 px-2 -ml-2 rounded-md w-full text-left bg-transparent border-0 cursor-pointer transition-colors",
                  isSelected
                    ? "bg-white/[0.06]"
                    : "hover:bg-white/[0.03]"
                )}
                aria-expanded={isSelected}
                aria-label={`Version ${v.raw}${isLatest ? ", latest" : ""}, ${v.type} release`}
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute -left-[calc(0.75rem+7px)] rounded-full border-2 shrink-0 transition-all",
                    isLatest ? style.dot : TYPE_STYLES[v.type].dot
                  )}
                />

                {/* Version text */}
                <span
                  className={cn(
                    "font-mono text-sm transition-colors",
                    isLatest ? style.text : TYPE_STYLES[v.type].text
                  )}
                >
                  {v.raw}
                </span>

                {/* Labels */}
                <div className="flex gap-1.5 items-center">
                  {isLatest && (
                    <span className="text-[0.6rem] px-1.5 py-px bg-[#4156E1]/20 text-[#4156E1] rounded-full border border-[#4156E1]/30 uppercase tracking-wider">
                      latest
                    </span>
                  )}
                  {v.type !== "patch" && !isLatest && (
                    <span
                      className={cn(
                        "text-[0.6rem] px-1.5 py-px rounded-full border uppercase tracking-wider",
                        TYPE_STYLES[v.type].labelStyle
                      )}
                    >
                      {TYPE_STYLES[v.type].label}
                    </span>
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {isSelected && (
                <div
                  className="ml-6 mt-1 mb-2 p-3 rounded-lg bg-white/[0.03] border border-[rgba(149,178,184,0.15)] text-sm space-y-2"
                  role="region"
                  aria-label={`Details for version ${v.raw}`}
                >
                  <div className="flex items-center gap-2">
                    <code className="text-[#4156E1] font-mono">pkgx {project}@{v.raw}</code>
                    <CopyButton text={`pkgx ${project}@${v.raw}`} />
                  </div>
                  <p className="text-xs text-[rgba(237,242,239,0.5)]">
                    {v.type === "major"
                      ? "Major release with potential breaking changes."
                      : v.type === "minor"
                      ? "Minor release with new features."
                      : "Patch release with bug fixes."}
                  </p>
                  <a
                    href={`https://github.com/pkgxdev/pantry/tree/main/projects/${project}/package.yml`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#4156E1] hover:underline"
                  >
                    View package definition &rarr;
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show more / request version */}
      <div className="space-y-2 pl-5">
        {hasMore && (
          <button
            onClick={handleShowMore}
            className="text-xs text-[#4156E1] hover:underline bg-transparent border-0 cursor-pointer p-0"
          >
            Show {Math.min(EXPAND_INCREMENT, filtered.length - showCount)} more
            {filtered.length - showCount > EXPAND_INCREMENT &&
              ` (${filtered.length - showCount} remaining)`}
          </button>
        )}
        <p className="text-xs text-[rgba(237,242,239,0.4)]">
          Need a version we don't have?{" "}
          <a
            href={`https://github.com/pkgxdev/pantry/issues/new?title=version+request:+${project}`}
            className="text-[#4156E1] hover:underline"
          >
            Request it here
          </a>
        </p>
      </div>
    </div>
  );
}

/** Small copy-to-clipboard button */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleCopy(); }}
      className="text-xs px-1.5 py-0.5 rounded bg-white/5 border border-[rgba(149,178,184,0.2)] hover:bg-white/10 transition-colors cursor-pointer text-[rgba(237,242,239,0.5)]"
      title="Copy to clipboard"
      aria-label={copied ? "Copied!" : "Copy install command"}
    >
      {copied ? "✓" : "copy"}
    </button>
  );
}
