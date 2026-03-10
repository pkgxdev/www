import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { useParams, Link as RouterLink } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { isArray, isPlainObject } from "is-what";
import InstallSnippets from "../components/PackageDetail/InstallSnippets";
import VersionHistory from "../components/PackageDetail/VersionHistory";
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
    return <div className="h-6 bg-white/5 rounded animate-pulse" />;
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

function Package({ project, dirs }: { project: string; dirs: string[] }) {
  const isxs = useIsMobile();

  const { loading, error, value } = useAsync(async () => {
    const url = `https://raw.githubusercontent.com/pkgxdev/pantry/main/projects/${project}/package.yml`;
    const rsp = await fetch(url);
    const txt = await rsp.text();
    return yaml.parse(txt);
  }, [project]);

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

  const imgsrc = `/pkgs/${project}.webp`;

  const buttons = description.value && (
    <>
      {description.value.homepage && (
        <a
          href={description.value.homepage}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-[rgba(149,178,184,0.3)] rounded text-sm hover:bg-white/5 transition-colors no-underline"
        >
          Homepage <ArrowUpRight className="w-3 h-3" />
        </a>
      )}
      {description.value.github && (
        <a
          href={description.value.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-[rgba(149,178,184,0.3)] rounded text-sm hover:bg-white/5 transition-colors no-underline"
        >
          GitHub <ArrowUpRight className="w-3 h-3" />
        </a>
      )}
    </>
  );

  return (
    <div className={cn("flex gap-6", isxs ? "flex-col" : "flex-row")}>
      <div className="rounded-lg border border-[rgba(149,178,184,0.3)] overflow-hidden shrink-0 self-start min-w-[375px]">
        <img src={imgsrc} width={375} height={375} className="block" alt={project} />
      </div>
      <div className="space-y-4 flex-1">
        <div>
          <h2 className="text-3xl mb-2">{title()}</h2>
          {description_body()}
          <README project={project} />
          <div className="flex flex-wrap gap-2 mt-6">
            <a
              href={`https://github.com/pkgxdev/pantry/tree/main/projects/${project}/package.yml`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-[rgba(149,178,184,0.3)] rounded text-sm hover:bg-white/5 transition-colors no-underline"
            >
              View package.yml <ArrowUpRight className="w-3 h-3" />
            </a>
            {buttons}
          </div>
        </div>

        <InstallSnippets project={project} provides={description.value?.provides ?? undefined} />

        <div>{metadata()}</div>

        {value && (
          <DependencyGraph
            dependencies={value?.dependencies ?? {}}
            companions={value?.companions ?? {}}
            project={project}
          />
        )}

        <VersionsSection project={project} />

        {dirs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Subprojects</h3>
            <Listing dirs={dirs} />
          </div>
        )}
      </div>
    </div>
  );

  function title() {
    if (description.loading) {
      return get_pkg_name(project);
    } else if (description.value?.displayName) {
      return (
        <>
          {description.value?.displayName}{" "}
          <span className="text-lg text-[rgba(237,242,239,0.7)]">({get_pkg_name(project)})</span>
        </>
      );
    } else {
      return get_pkg_name(project);
    }
  }

  function codeblock() {
    if (description.value?.provides?.length != 1) {
      return `sh <(curl https://pkgx.sh) +${project} -- $SHELL -i`;
    } else {
      return `sh <(curl https://pkgx.sh) ${description.value!.provides[0]}`;
    }
  }

  function description_body() {
    if (description.loading) {
      return <div className="h-6 bg-white/5 rounded animate-pulse" />;
    } else if (description.error) {
      return (
        <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">
          {description.error.message}
        </div>
      );
    } else {
      return <p className="text-lg text-[rgba(237,242,239,0.7)]">{description.value!.description}</p>;
    }
  }

  function metadata() {
    if (description.loading) {
      return <div className="h-6 bg-white/5 rounded animate-pulse" />;
    } else if (description.error) {
      return (
        <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">
          {description.error.message}
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Programs</h3>
            {programs()}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Companions</h3>
            {companions()}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Dependencies</h3>
            {deps()}
          </div>
        </div>
      );

      function programs() {
        const provides: string[] = description.value?.provides ?? [];
        if (!isArray(provides)) {
          return <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">Unexpected error</div>;
        } else if (provides.length) {
          return (
            <ul>
              {provides.map((program, i) => (
                <li key={i}>
                  <code>{program.replace(/^s?bin\//g, "")}</code>
                </li>
              ))}
            </ul>
          );
        } else {
          return <p>None</p>;
        }
      }

      function companions() {
        const companions: Record<string, string> = value?.companions ?? {};
        if (!isPlainObject(companions)) {
          return <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">Unexpected error</div>;
        } else {
          const entries = Object.entries(companions);
          if (entries.length) {
            return (
              <ul>
                {entries.map(([companion]) => (
                  <li key={companion}>
                    <RouterLink to={`/pkgs/${companion}/`} className="text-[#4156E1] hover:underline">
                      {companion}
                    </RouterLink>
                  </li>
                ))}
              </ul>
            );
          } else {
            return <p>None</p>;
          }
        }
      }

      function deps() {
        const deps: Record<string, string> = value?.dependencies ?? {};
        if (!isPlainObject(deps)) {
          return <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">Unexpected error</div>;
        } else {
          return entries(deps);
        }

        function entries(deps: Record<string, string>) {
          const entries_arr = Object.entries(deps);
          if (entries_arr.length) {
            return <ul>{entries_arr.map(entry)}</ul>;
          } else {
            return <p>None</p>;
          }
        }

        function entry([name, version]: [name: string, version: string | Record<string, string>]) {
          if (isPlainObject(version)) {
            return (
              <li key={name}>
                {name}
                {entries(version)}
              </li>
            );
          } else {
            return (
              <li key={name}>
                <RouterLink to={`/pkgs/${name}/`} className="text-[#4156E1] hover:underline">
                  {name}
                  {pretty(version)}
                </RouterLink>
              </li>
            );
          }
        }

        function pretty(version: string) {
          if (version == "*") return "";
          else if (/^\d/.test(version)) return `@${version}`;
          else return version;
        }
      }
    }
  }
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
    return <div className="h-6 bg-white/5 rounded animate-pulse" />;
  } else if (state.error) {
    return (
      <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">
        {state.error.message}
      </div>
    );
  } else if (state.value) {
    return <Markdown txt={state.value} />;
  } else {
    return null;
  }
}

function VersionsSection({ project }: { project: string }) {
  const state = useAsync(async () => {
    let rsp = await fetch(`https://dist.pkgx.dev/${project}/darwin/aarch64/versions.txt`);
    if (!rsp.ok) rsp = await fetch(`https://dist.pkgx.dev/${project}/linux/x86-64/versions.txt`);
    const txt = await rsp.text();
    const versions = txt.split("\n").filter(v => v.trim());
    return versions.sort().reverse();
  }, [project]);

  if (state.loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-white/5 rounded animate-pulse" />
        <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
      </div>
    );
  } else if (state.error) {
    return (
      <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">
        {state.error.message}
      </div>
    );
  } else {
    return (
      <VersionHistory versions={state.value!} project={project} />
    );
  }
}
