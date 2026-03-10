import { Link } from "react-router-dom";
import { isPlainObject } from "is-what";
import { cn } from "../../utils/cn";

interface DependencyGraphProps {
  dependencies: Record<string, string | Record<string, string>>;
  companions: Record<string, string>;
  project: string;
}

function flattenDeps(
  deps: Record<string, string | Record<string, string>>,
  type: "runtime" | "build" = "runtime"
): Array<{ name: string; version: string; type: "runtime" | "build" }> {
  const result: Array<{ name: string; version: string; type: "runtime" | "build" }> = [];
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

export default function DependencyGraph({
  dependencies,
  companions,
  project,
}: DependencyGraphProps) {
  const runtimeDeps = flattenDeps(dependencies, "runtime");
  const companionList = Object.entries(companions);
  const total = runtimeDeps.length + companionList.length;

  if (total === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-[rgba(237,242,239,0.7)] uppercase tracking-wider">
        Dependency Graph
      </h4>

      <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] p-4">
        {/* Root node */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-[#4156E1]" />
          <span className="font-mono text-sm font-semibold text-[#4156E1]">{project}</span>
          <span className="text-xs text-[rgba(237,242,239,0.4)]">
            {total} {total === 1 ? "dependency" : "dependencies"}
          </span>
        </div>

        {/* Runtime Dependencies */}
        {runtimeDeps.length > 0 && (
          <div className="ml-4 pl-4 border-l border-[rgba(149,178,184,0.2)] space-y-1">
            {runtimeDeps.map(({ name, version }) => (
              <div key={name} className="flex items-center gap-2 py-0.5">
                <div className="absolute -ml-[1.13rem] w-2 h-2 rounded-full bg-[rgba(237,242,239,0.3)]" />
                <span className="w-1.5 h-px bg-[rgba(149,178,184,0.3)]" />
                <Link
                  to={`/pkgs/${name}/`}
                  className="font-mono text-sm text-[#EDF2EF] hover:text-[#4156E1] transition-colors no-underline"
                >
                  {name}
                  <span className="text-[rgba(237,242,239,0.5)]">{formatVersion(version)}</span>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Companions */}
        {companionList.length > 0 && (
          <>
            <p className="text-xs text-[rgba(237,242,239,0.5)] mt-3 mb-1 ml-4">Companions</p>
            <div className="ml-4 pl-4 border-l border-[#F26212]/30 space-y-1">
              {companionList.map(([name]) => (
                <div key={name} className="flex items-center gap-2 py-0.5">
                  <span className="w-1.5 h-px bg-[#F26212]/30" />
                  <Link
                    to={`/pkgs/${name}/`}
                    className="font-mono text-sm text-[#F26212] hover:text-[#EDF2EF] transition-colors no-underline"
                  >
                    {name}
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
