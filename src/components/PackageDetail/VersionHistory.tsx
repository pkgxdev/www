import { cn } from "../../utils/cn";
import { useIsMobile } from "../../utils/useIsMobile";

interface VersionHistoryProps {
  versions: string[];
  project: string;
}

function classifyVersion(version: string): "major" | "minor" | "patch" {
  const parts = version.split(".");
  if (parts.length >= 3 && parts[2] === "0" && parts[1] === "0") return "major";
  if (parts.length >= 2 && parts[parts.length - 1] === "0") return "minor";
  return "patch";
}

export default function VersionHistory({ versions, project }: VersionHistoryProps) {
  const isxs = useIsMobile();
  const displayVersions = versions.filter(v => v.trim()).slice(0, 20);

  if (displayVersions.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-[rgba(237,242,239,0.7)] uppercase tracking-wider">
        Version History
      </h4>
      <div className="relative pl-4 border-l-2 border-[rgba(149,178,184,0.2)] space-y-1">
        {displayVersions.map((version, i) => {
          const vtype = classifyVersion(version);
          const isMajor = vtype === "major";
          const isMinor = vtype === "minor";

          return (
            <div
              key={version}
              className={cn(
                "relative flex items-center gap-3 py-0.5",
                i === 0 && "animate-fade-in"
              )}
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute -left-[calc(1rem+5px)] w-2.5 h-2.5 rounded-full border-2",
                  i === 0
                    ? "bg-[#4156E1] border-[#4156E1]"
                    : isMajor
                    ? "bg-[#F26212] border-[#F26212]"
                    : isMinor
                    ? "bg-[rgba(237,242,239,0.4)] border-[rgba(237,242,239,0.4)]"
                    : "bg-transparent border-[rgba(149,178,184,0.3)]"
                )}
              />

              {/* Version badge */}
              <span
                className={cn(
                  "font-mono text-sm",
                  i === 0
                    ? "text-[#4156E1] font-bold"
                    : isMajor
                    ? "text-[#EDF2EF] font-semibold"
                    : "text-[rgba(237,242,239,0.6)]"
                )}
              >
                {version}
              </span>

              {/* Labels */}
              {i === 0 && (
                <span className="text-[0.65rem] px-1.5 py-0 bg-[#4156E1]/20 text-[#4156E1] rounded-full border border-[#4156E1]/30">
                  latest
                </span>
              )}
              {isMajor && i !== 0 && (
                <span className="text-[0.65rem] px-1.5 py-0 bg-[#F26212]/20 text-[#F26212] rounded-full border border-[#F26212]/30">
                  major
                </span>
              )}
            </div>
          );
        })}
      </div>
      {versions.length > 20 && (
        <p className="text-xs text-[rgba(237,242,239,0.5)] pl-4">
          + {versions.length - 20} more versions
        </p>
      )}
      <p className="text-xs text-[rgba(237,242,239,0.5)]">
        Need a version we don't have?{" "}
        <a
          href={`https://github.com/pkgxdev/pantry/issues/new?title=version+request:+${project}`}
          className="text-[#4156E1] hover:underline"
        >
          Request it here
        </a>
      </p>
    </div>
  );
}
