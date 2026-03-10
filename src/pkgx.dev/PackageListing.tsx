import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { useParams, Link as RouterLink } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { isArray, isPlainObject } from "is-what";
import PackageDetailLayout from "../components/PackageDetail/PackageDetailLayout";
import InstallSnippets from "../components/PackageDetail/InstallSnippets";
import TrustSignals, { GitHubLink } from "../components/PackageDetail/TrustSignals";
import PackageSEO from "../components/PackageDetail/PackageSEO";
import VersionTimeline from "../components/PackageDetail/VersionTimeline";
import DependencyGraph from "../components/PackageDetail/DependencyGraph";
import get_pkg_name from "../utils/pkg-name";
import { useIsMobile } from "../utils/useIsMobile";
import { useAsync } from "react-use";
import { cn } from "../utils/cn";
import yaml from "yaml";
import Markdown from "../components/Markdown";

function dirname(path: string | undefined) {
  path ??= "";
  path = path.trim().replace(/\/+$/, "");
  const ii = path.lastIndexOf("/");
  return ii >= 0 ? path.slice(ii + 1) : path;
}

export default function PackageListing() {
  const { "*": splat } = useParams();
  const project = splat?.slice(0, -1);

  const { loading, value, error } = useAsync(async () => {
    const client = new S3Client({
      region: "us-east-1",
      signer: { sign: async (request) => request },
    });
    const command = new ListObjectsV2Command({
      Bucket: "dist.pkgx.dev",
      Delimiter: `/`,
      Prefix: splat,
    });
    const data = await client.send(command);

    let ispkg = false;

    const dirs =
      data.CommonPrefixes?.filter(({ Prefix }) => {
        switch (dirname(Prefix)) {
          case "darwin":
          case "linux":
          case "windows":
            ispkg = true;
          // fall through
          case "":
          case undefined:
            return false;
          default:
            return true;
        }
      }).map((x) => x.Prefix!) ?? [];

    document.title = `${project || "pkgs"} — pkgx`;

    return { dirs, ispkg };
  }, [splat]);

  if (loading) {
    return <PackageLoadingSkeleton />;
  } else if (error) {
    return <Package project={project!} dirs={[]} />;
  } else {
    const { dirs, ispkg } = value!;
    return (
      <div className="space-y-6">
        {ispkg ? <Package project={project!} dirs={dirs} /> : <Listing dirs={dirs} />}
      </div>
    );
  }
}

function Listing({ dirs }: { dirs: string[] }) {
  return (
    <ul>
      {dirs.map((obj) => (
        <li key={obj}>
          <RouterLink to={`/pkgs/${obj}`} className="text-[#4156E1] hover:underline">
            {obj}
          </RouterLink>
        </li>
      ))}
    </ul>
  );
}

function PackageLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-white/5 rounded w-1/3" />
      <div className="h-6 bg-white/5 rounded w-2/3" />
      <div className="h-32 bg-white/5 rounded" />
      <div className="flex gap-2">
        <div className="h-8 bg-white/5 rounded w-24" />
        <div className="h-8 bg-white/5 rounded w-24" />
        <div className="h-8 bg-white/5 rounded w-24" />
      </div>
      <div className="grid grid-cols-[280px_1fr] gap-6">
        <div className="space-y-4">
          <div className="h-48 bg-white/5 rounded" />
          <div className="h-32 bg-white/5 rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-64 bg-white/5 rounded" />
          <div className="h-48 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}

function Package({ project, dirs }: { project: string; dirs: string[] }) {
  const isxs = useIsMobile();

  // Fetch package.yml from pantry
  const { loading: yamlLoading, value: yamlData } = useAsync(async () => {
    const url = `https://raw.githubusercontent.com/pkgxdev/pantry/main/projects/${project}/package.yml`;
    const rsp = await fetch(url);
    const txt = await rsp.text();
    return yaml.parse(txt);
  }, [project]);

  // Fetch package metadata
  const description = useAsync(async () => {
    const rsp = await fetch(`/pkgs/${project}.json`);
    if (rsp.ok) {
      return (await rsp.json()) as {
        description: string;
        homepage: string;
        github: string;
        displayName: string;
        provides: string[];
      };
    } else {
      return { description: null, homepage: null, github: null, displayName: null, provides: null };
    }
  }, [project]);

  // Fetch versions
  const versionsState = useAsync(async () => {
    let rsp = await fetch(`https://dist.pkgx.dev/${project}/darwin/aarch64/versions.txt`);
    if (!rsp.ok) rsp = await fetch(`https://dist.pkgx.dev/${project}/linux/x86-64/versions.txt`);
    const txt = await rsp.text();
    const versions = txt.split("\n").filter((v) => v.trim());
    return versions.sort().reverse();
  }, [project]);

  const imgsrc = `/pkgs/${project}.webp`;
  const latestVersion = versionsState.value?.[0];

  // ---- HEADER ----
  const header = (
    <>
      <PackageSEO
        project={project}
        displayName={description.value?.displayName}
        description={description.value?.description}
        homepage={description.value?.homepage}
      />
      <div className={cn("flex gap-6 items-start", isxs && "flex-col")}>
        {/* Package image */}
        <div className="rounded-lg border border-[rgba(149,178,184,0.3)] overflow-hidden shrink-0 self-start">
          <img
            src={imgsrc}
            width={isxs ? 200 : 120}
            height={isxs ? 200 : 120}
            className="block"
            alt={`${project} logo`}
            loading="eager"
          />
        </div>

        {/* Title + description */}
        <div className="flex-1 space-y-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-3xl font-bold">{renderTitle()}</h2>
            {latestVersion && (
              <span className="text-sm font-mono text-[rgba(237,242,239,0.5)] bg-white/5 px-2 py-0.5 rounded">
                v{latestVersion}
              </span>
            )}
          </div>

          {description.loading ? (
            <div className="h-6 bg-white/5 rounded animate-pulse w-2/3" />
          ) : description.value?.description ? (
            <p className="text-lg text-[rgba(237,242,239,0.7)]">{description.value.description}</p>
          ) : null}

          <GitHubLink github={description.value?.github ?? undefined} />
        </div>
      </div>
    </>
  );

  // ---- INSTALL ----
  const install = (
    <InstallSnippets project={project} provides={description.value?.provides ?? undefined} />
  );

  // ---- TRUST SIGNALS ----
  const trustSignals = (
    <TrustSignals
      github={description.value?.github ?? undefined}
      hasReadme={true}
    />
  );

  // ---- SIDEBAR ----
  const sidebar = (
    <>
      {/* Links */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-[rgba(237,242,239,0.7)] uppercase tracking-wider">
          Links
        </h4>
        <div className="space-y-1">
          <SidebarLink
            href={`https://github.com/pkgxdev/pantry/tree/main/projects/${project}/package.yml`}
            label="View package.yml"
          />
          {description.value?.homepage && (
            <SidebarLink href={description.value.homepage} label="Homepage" />
          )}
          {description.value?.github && (
            <SidebarLink href={description.value.github} label="GitHub" />
          )}
        </div>
      </div>

      {/* Programs */}
      {description.value && <ProgramsList provides={description.value.provides ?? []} />}

      {/* Version Timeline (sidebar on desktop) */}
      {versionsState.loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-white/5 rounded animate-pulse" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
        </div>
      ) : versionsState.value ? (
        <VersionTimeline versions={versionsState.value} project={project} />
      ) : null}

      {/* Dependency Graph (sidebar on desktop) */}
      {yamlData && (
        <DependencyGraph
          dependencies={yamlData.dependencies ?? {}}
          companions={yamlData.companions ?? {}}
          project={project}
        />
      )}
    </>
  );

  // ---- MAIN CONTENT ----
  const mainContent = (
    <>
      {/* README */}
      <README project={project} />

      {/* Metadata tables */}
      {!description.loading && !description.error && description.value && yamlData && (
        <MetadataSection
          provides={description.value.provides ?? []}
          companions={yamlData.companions ?? {}}
          dependencies={yamlData.dependencies ?? {}}
        />
      )}

      {/* Subprojects */}
      {dirs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Subprojects</h3>
          <Listing dirs={dirs} />
        </div>
      )}
    </>
  );

  return (
    <PackageDetailLayout
      header={header}
      install={install}
      trustSignals={trustSignals}
      sidebar={sidebar}
      mainContent={mainContent}
    />
  );

  function renderTitle() {
    if (description.loading) {
      return get_pkg_name(project);
    } else if (description.value?.displayName) {
      return (
        <>
          {description.value.displayName}{" "}
          <span className="text-lg text-[rgba(237,242,239,0.5)] font-normal">
            ({get_pkg_name(project)})
          </span>
        </>
      );
    } else {
      return get_pkg_name(project);
    }
  }
}

/** Sidebar link component */
function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1.5 text-sm text-[rgba(237,242,239,0.6)] hover:text-[#4156E1] transition-colors no-underline py-0.5"
    >
      <ArrowUpRight className="w-3 h-3 shrink-0" aria-hidden="true" />
      {label}
    </a>
  );
}

/** Programs list for sidebar */
function ProgramsList({ provides }: { provides: string[] }) {
  if (!isArray(provides) || provides.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-[rgba(237,242,239,0.7)] uppercase tracking-wider">
        Programs
      </h4>
      <div className="flex flex-wrap gap-1">
        {provides.map((program, i) => (
          <code
            key={i}
            className="text-xs bg-white/5 border border-[rgba(149,178,184,0.2)] px-1.5 py-0.5 rounded"
          >
            {program.replace(/^s?bin\//g, "")}
          </code>
        ))}
      </div>
    </div>
  );
}

/** Metadata section in main content */
function MetadataSection({
  provides,
  companions,
  dependencies,
}: {
  provides: string[];
  companions: Record<string, string>;
  dependencies: Record<string, string | Record<string, string>>;
}) {
  const companionEntries = Object.entries(companions);
  const depEntries = Object.entries(dependencies);

  if (provides.length === 0 && companionEntries.length === 0 && depEntries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-4 border-t border-[rgba(149,178,184,0.1)]">
      <h3 className="text-lg font-semibold">Package Details</h3>

      {companionEntries.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[rgba(237,242,239,0.7)] mb-1">
            Companions
          </h4>
          <ul className="space-y-0.5">
            {companionEntries.map(([name]) => (
              <li key={name}>
                <RouterLink
                  to={`/pkgs/${name}/`}
                  className="text-sm text-[#4156E1] hover:underline"
                >
                  {name}
                </RouterLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {depEntries.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[rgba(237,242,239,0.7)] mb-1">
            Dependencies
          </h4>
          <ul className="space-y-0.5">
            {depEntries.map(([name, version]) => {
              if (isPlainObject(version)) {
                return (
                  <li key={name}>
                    <span className="text-sm text-[rgba(237,242,239,0.6)]">{name}</span>
                    <ul className="ml-4 space-y-0.5">
                      {Object.entries(version).map(([subName, subVer]) => (
                        <li key={subName}>
                          <RouterLink
                            to={`/pkgs/${subName}/`}
                            className="text-sm text-[#4156E1] hover:underline"
                          >
                            {subName}
                            {subVer !== "*" && (
                              <span className="text-[rgba(237,242,239,0.4)]">
                                {/^\d/.test(subVer) ? `@${subVer}` : subVer}
                              </span>
                            )}
                          </RouterLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li key={name}>
                  <RouterLink
                    to={`/pkgs/${name}/`}
                    className="text-sm text-[#4156E1] hover:underline"
                  >
                    {name}
                    {version !== "*" && (
                      <span className="text-[rgba(237,242,239,0.4)]">
                        {/^\d/.test(version) ? `@${version}` : version}
                      </span>
                    )}
                  </RouterLink>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function README({ project }: { project: string }) {
  const state = useAsync(async () => {
    let rsp = await fetch(
      `https://raw.githubusercontent.com/pkgxdev/pantry/main/projects/${project}/README.md`
    );
    if (rsp.ok) {
      return await rsp.text();
    }
  }, [project]);

  if (state.loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-white/5 rounded animate-pulse" />
        <div className="h-4 bg-white/5 rounded animate-pulse w-4/5" />
        <div className="h-4 bg-white/5 rounded animate-pulse w-3/5" />
      </div>
    );
  } else if (state.error) {
    return (
      <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300 text-sm">
        {state.error.message}
      </div>
    );
  } else if (state.value) {
    return (
      <div className="prose-invert max-w-none">
        <Markdown txt={state.value} />
      </div>
    );
  } else {
    return null;
  }
}
