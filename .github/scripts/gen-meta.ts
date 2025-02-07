#!/usr/bin/env -S pkgx deno^2 run --allow-net --allow-write=public/pkgs,cache --allow-read --unstable-kv --allow-env --allow-run

//TODO if no homepage at the end check of it all check the project name for a 200 HEAD request
//TODO if no github check if project name is a github
//TODO sometimes the github homepageUrl is actually the docs url and the project ID is actually the homepage
//TODO do the github figure out -> description + homepage first as brew provides lookup should be a last resort I think eg. xcodeproj
//TODO use gems, pypi, crates etc. to get better homepage, description, etc.

import { fromFileUrl, dirname, join } from "jsr:@std/path@^1.0.8";
import { parseArgs } from "jsr:@std/cli@^1.0.11/parse-args";
import { ensureDirSync } from "jsr:@std/fs";
import { existsSync } from "node:fs";
import { Path, hooks } from "https://deno.land/x/libpkgx@v0.20.3/mod.ts";
import levenshtein from "https://deno.land/x/levenshtein/mod.ts";
const { usePantry } = hooks;

const args = parseArgs(Deno.args, {
  boolean: ['all']
});

const kv = await Deno.openKv();

const root = join(dirname(dirname(dirname(fromFileUrl(import.meta.url)))));
const out = join(root, 'public/pkgs');
ensureDirSync(out);

const json = await get_formula_json();

console.error("get")
const got = new Set()
for await (const { key: [,formula] } of kv.list({prefix: ['formula']})) {
  got.add(formula);
}
console.error("got", got.size);

console.error("go")
for (const obj of json) {

  const {name, desc: description, homepage, license, urls: {head, stable}, ruby_source_path} = obj;

  if (got.has(name) || name.includes("@")) {
    continue
  }

  const {manifests, version} = await get_manifest(obj);
  if (!manifests) continue;

  for (const manifest of manifests) {
    const brew_url = `https://formulae.brew.sh/formula/${name}`;
    const brew_rb_url = `https://github.com/Homebrew/homebrew-core/blob/main/${ruby_source_path}`;
    const github = try_github(head, homepage)
    kv.set(['formula', name], {version, description, homepage, license, brew_url, brew_rb_url, github, src: stable.url});

    let provides = manifest.annotations?.['sh.brew.path_exec_files'];
    if (provides) {
      provides = provides.split(",");
      for (const provide of provides) {
        const { ff: existing } = (await kv.get(['provides', provide])).value as { ff: string[] } | null ?? {ff: []};
        const new_value = [...new Set([...existing, name])];
        kv.set(['provides', provide], {ff: new_value});
      }
      break;
    }
  }
}

console.error('writing');

for await (const { project } of desired_pantry_entries()) {
  console.log("processing", project);

  const fn = join(out, `${project}.json`);

  if (!args.all && args._.length == 0 && existsSync(fn)) {
    continue;
  }

  const pantry_entry = await usePantry().project(project)
  const yaml = await pantry_entry.yaml();
  const provides = await pantry_entry.provides();
  let { homepage, description, brew_url, license, github } = await assign(yaml, provides, project) ?? {};

  const displayName = yaml?.['display-name'] || get_display_name(provides, project);

  let gh_description: string | undefined = undefined;

  if (!github) {
    if (yaml?.versions?.github) {
      const foo = yaml.versions.github.split('/', 2).join('/');
      github = `https://github.com/${foo}`;
    } else {
      const url = yaml?.distributable?.url;
      if (url && /github.com\//.test(url)) {
        const match = url.match(/github.com\/([^\/]+)\/([^\/]+)/);
        const [_, owner, repo] = match;
        if (owner && repo) {
          github = `https://github.com/${owner}/${repo}`;
        }
      }
    }
  }

  if (github) {
    const gh = await get_github_JSON_values(github);

    if (homepage == github) {
      homepage = undefined;
    }
    if (!homepage && github) {
      homepage = gh?.homepageUrl;
    }
    if (homepage == github) {
      homepage = undefined;
    }

    if (!description) {
      description = gh?.description;
    } else {
      gh_description = gh?.description;
    }

    if (!homepage?.trim()) homepage = undefined;
    if (!description?.trim()) description = undefined;
  }

  let brief = (gh_description?.length ?? 0) < (description?.length ?? 0) ? gh_description : description;
  description = (gh_description?.length ?? 0) < (description?.length ?? 0) ? description : gh_description;

  if (!description?.trim()) description = undefined;
  if (!brief?.trim()) brief = undefined;
  if (!description && brief) {
    description = brief;
    brief = undefined;
  }
  if (description == brief) {
    brief = undefined;
  }

  if (github?.endsWith('.git')) {
    github = github.slice(0, -4);
  }

  if (homepage == `${github}/blob/main/README.md`) {
    homepage = undefined
  }
  if (brief == description) {
    brief = undefined;
  }
  if (homepage == `${github}/`) {
    // some github repos set homepage to almost the same as the github repo but with trailing slashes
    //TODO normalize pathnames or something
    homepage = undefined;
  }

  switch (project) {
  case 'github.com/brucedom/bruce':
    description = 'Basic Runtime for Uniform Compute Environments';
    // ^^ the github description is not useful
    break;
  case 'liburcu.org':
    brief = 'Userspace RCU (read-copy-update) library.'
    description = 'liburcu is a LGPLv2.1 userspace RCU (read-copy-update) library. This data synchronization library provides read-side access which scales linearly with the number of cores.'
  }

  let json: any = {
    brief, description, homepage, provides, brew_url, license, github, project, displayName
  }
  if (provides.length == 0) {
    delete json['provides'];
  }
  if (Object.values(json).length) {
    ensureDirSync(dirname(fn));
    const str = JSON.stringify(json, null, 2);
    if (str != "{}") {
      Deno.writeTextFileSync(fn, str);
    }
  }
}

async function assign(pantry_yaml: any, provides: string[], project: string) {
  const f = await (async () => {

    switch (project) {
    case 'freedesktop.org/intltool':
      // we provide several lwp-foo binaries that brew apparently do not
      // but the association is correct and we want their metadata
      return 'intltool';
    case 'freedesktop.org/cppunit':
      // manifest appears b0rked and is empty
      return 'cppunit';
    case 'freedesktop.org/poppler-qt5':
      // multiple formula provide all the same tools
      return 'poppler-qt5';
    case 'pkgx.sh/brewkit':
      // programs list preceisely matches the wrong thing
      return;
    case 'rust-lang.org/rustup':
      return 'rustup';
    case 'rust-lang.org':
      return 'rust';
    case 'rust-lang.org/rustup-init':
      return;  // package we shouldn’t have and I dunno why we do
    }

    const map: Record<string, string[]> = {}
    const set = new Set<string>();

    for (const provide of provides) {
      const ff = ((await kv.get(['provides', `bin/${provide}`])).value as { ff: string[] } | null)?.ff ?? [];
      map[provide] = ff;
      for (const f of ff) {
        set.add(f);
      }
    }

    const N = set.size;
    for (const f of set) {
      for (const [provide] of Object.entries(map)) {
        if (!map[provide].includes(f)) {
          if (N == 1) {
            console.error("%cNOTICE: we are excluding", 'color: red', f, "because provides is out of whack but you may want to check on that because it seemed like a good match");
          }
          set.delete(f);
        }
      }
    }

    if (set.size == 0) {
      console.error("%cwarning: nothing in brew seems to be:", 'color:yellow', project);
      return;
    }
    if (set.size > 1) {
      console.error("%cwarning: multiple formulae provide everything in:", 'color:yellow', project, [...set]);
      return;
    }

    return set.values().next().value!;
  })();

  if (!f) return;

  const brew_data = (await kv.get(["formula", f])).value as any;

  let pantry_src = pantry_yaml?.distributable?.url
  const brew_src = brew_data?.src;

  if (brew_src && pantry_src) {
    pantry_src = pantry_src.replaceAll(/{{\s*version\s*}}/g, brew_data.version);
    pantry_src = pantry_src.replaceAll(/{{\s*version.major\s*}}/g, brew_data.version.split(".")[0]);
    pantry_src = pantry_src.replaceAll(/{{\s*version.minor\s*}}/g, brew_data.version.split(".")[1]);
    pantry_src = pantry_src.replaceAll(/{{\s*version.patch\s*}}/g, brew_data.version.split(".")[2]);
    pantry_src = pantry_src.replaceAll(/{{\s*version.marketing\s*}}/g, brew_data.version.split(".").slice(0, 2).join("."));
    pantry_src = pantry_src.replaceAll(/{{\s*version.tag\s*}}/g, brew_data.version);
    pantry_src = pantry_src.replaceAll(/{{\s*version.raw\s*}}/g, brew_data.version);

    const distance = levenshtein(pantry_src, brew_src);
    const similarity = 1 - (distance / Math.max(pantry_src.length, brew_src.length));

    if (similarity < 0.84) {

      const urlbrew = new URL(brew_src);
      const urlpkgx = new URL(pantry_src);
      if (urlbrew.hostname == urlpkgx.hostname && urlbrew.hostname == "github.com") {
        let brewpath = urlbrew.pathname.split("/").slice(0, 3).join("/")
        let pkgxpath = urlpkgx.pathname.split("/").slice(0, 3).join("/")
        if (brewpath.endsWith('.git')) brewpath = brewpath.slice(0, -4);
        if (pkgxpath.endsWith('.git')) pkgxpath = pkgxpath.slice(0, -4);
        if (brewpath == pkgxpath) {
          // different flavors of github download urls for the same thing
          console.error("%cnote: brew packages", 'color:green', project, "as", f);
          return brew_data;
        }
      }

      // many flavors of sf.net urls (many include eg. mirrors, )
      if ((urlbrew.hostname.endsWith("sourceforge.net") || urlbrew.hostname.endsWith("sf.net")) && (urlpkgx.hostname.endsWith("sourceforge.net") || urlpkgx.hostname.endsWith("sf.net"))) {
        urlbrew.hostname = 'sf.net';
        urlpkgx.hostname = 'sf.net';
      }

      console.error("%cwarning: poor simularity", 'color: yellow', similarity);
      console.error("  brew:", brew_src);
      console.error("  pkgx:", pantry_src);
      console.error("%cnote: all the same we will asume brew packages", 'color: green', project, "as", f);
    } else {
      console.error("%cnote: brew packages", 'color:green', project, "as", f);
    }
    return brew_data;
  } else {
    console.error("%cnote: brew packages", 'color:green', project, "as", f);
    return brew_data;
  }
}

async function get_formula_json() {
  const headers: Record<string, string> = {};
  try {
    if (existsSync(join(root, './cache/_formula.json'))) {
      headers["If-None-Match"] = Deno.readTextFileSync(join(root, './cache/_formula.json.ETAG'));
    }
  } catch {}

  // send the contents of out/ETAG as the If-None-Match header
  const rsp = await fetch("https://formulae.brew.sh/api/formula.json", {headers});

  if (rsp.status == 304) {
    const data = Deno.readFileSync(join(root, "./cache/_formula.json"));
    const str = new TextDecoder().decode(data);
    return JSON.parse(str);
  }

  if (!rsp.ok) {
    console.error(rsp.status, rsp.statusText);
    Deno.exit(1);
  }

  // store the etag in out/ETAG
  const etag = rsp.headers.get("etag");
  const json = await rsp.json();

  if (etag) {
    Deno.writeTextFileSync(join(root, './cache/_formula.json.ETAG'), etag);
    Deno.writeTextFileSync(join(root, './cache/_formula.json'), JSON.stringify(json, null, 2));
  }

  return json
}

async function get_manifest({name, versions: {stable}, revision, bottle: {stable: {rebuild}}}: any) {
  const version = typeof stable == 'string' ? stable : {stable}

  //TODO check age is less than 3 hours, then do ETAG check
  if (existsSync(join(root, `./cache/${name}-manifests.json`))) {
    const data = Deno.readFileSync(join(root, `./cache/${name}-manifests.json`));
    const str = new TextDecoder().decode(data);
    return { ...JSON.parse(str), version };
  }

  let url = `https://ghcr.io/v2/homebrew/core/${name.replaceAll('+', 'x')}/manifests/${version}`;
  if (revision || stable.revision || stable.revision === 0) {
    url += `_${revision || stable.revision}`;
  }
  if (rebuild) {
    url += `-${rebuild}`;
  }

  const headers: Record<string, string> = {
    "Authorization": "Bearer QQ==",
    "Accept": "application/vnd.oci.image.index.v1+json"
  };
  try {
    if (existsSync(join(root, `./cache/${name}-manifests.json`))) {
      headers["If-None-Match"] = Deno.readTextFileSync(join(root, `./cache/${name}-manifests.json.ETAG`));
    }
  } catch {}

  //TODO no auth token I have tried works but that would get us better rate limits
  const rsp = await fetch(url, { headers });

  if (rsp.status == 304) {
    const data = Deno.readFileSync(join(root, `./cache/${name}-manifests.json`));
    const str = new TextDecoder().decode(data);
    return { ...JSON.parse(str), version };
  }

  if (!rsp.ok) {
    if (rsp.status == 404) {
      console.error("error: manifest not found:", name, url);
      return { manifests: undefined, version: undefined };
    } else {
      console.error("error:", name, rsp.statusText);
      return { manifests: undefined, version: undefined };
    }
  }

  // store the etag in out/ETAG
  const etag = rsp.headers.get("etag");
  const json = await rsp.json();

  if (etag) {
    Deno.writeTextFileSync(join(root, `./cache/${name}-manifests.json.ETAG`), etag);
    Deno.writeTextFileSync(join(root, `./cache/${name}-manifests.json`), JSON.stringify(json, null, 2));
  }

  // we have no github auth so we can only request 20 times a second at most
  await new Promise(resolve => setTimeout(resolve, 20));

  return { ...json, version };
}

function try_github(head: { url: string } | null, homepage: string) {
  let rv = get();
  if (rv?.endsWith('./cache')) {
    rv = rv.slice(0, -4);
  }
  return rv;

  function get() {
    if (/github.com\//.test(homepage)) {
      const match = homepage.match(/github.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const [_, owner, repo] = match;
        return `https://github.com/${owner}/${repo}`;
      }
    }

    if (head?.url && /github.com\//.test(head.url)) {
      const url = head.url;

      const match = url.match(/github.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const [_, owner, repo] = match;
        return `https://github.com/${owner}/${repo}`;
      }
    }

    const match = homepage.match(/([^\/]+).github.io\/([^\/]+)/);
    if (match) {
      const [_, owner, repo] = match;
      return `https://github.com/${owner}/${repo}`;
    }
  }
}

async function get_github_JSON_values(github: string): Promise<{ description?: string, homepageUrl?: string } | undefined> {
  const cmd = new Deno.Command("pkgx", {
    args: ["--quiet", "gh", "repo", "view", github, "--json", "description,homepageUrl"],
    stdout: "piped",
  }).spawn();

  const {success} = await cmd.status;
  if (success) {
    const output = new TextDecoder().decode((await cmd.output()).stdout).trim();
    return JSON.parse(output);
  }
}

async function* desired_pantry_entries(): AsyncGenerator<{project: string, path: Path}> {
  if (args._.length > 0) {
    for (let project of args._) {
      project = `${project}`;
      yield { project, path: usePantry().prefix.join(project, 'package.yml') };
    }
  } else for await (const entry of usePantry().ls()) {
    yield entry;
  }
}

function get_display_name(provides: string[], project: string) {
  switch (project) {
  case 'sourceforge.net/xmlstar':
    return 'XMLStarlet';
  case 'apache.org/arrow':
  case 'oracle.com/berkeley-db':
  case 'classic.yarnpkg.com':
  case 'httpie.io':
  case 'libarchive.org':
  case 'poppler.freedesktop.org':
  case 'smartmontools.org':
    return;
  }

  if (provides.length == 0) {
    return;
  } else if (provides.length == 1) {
    return provides[0];
  } else {
    return common_prefix(provides);
  }

  function common_prefix(strings: string[]): string | undefined {
    let prefix = strings[0];
    for (const str of strings) {
      while (str.indexOf(prefix) !== 0) {
        prefix = prefix.slice(0, -1);
        if (prefix === "") return undefined;
      }
    }
    if (prefix.endsWith('-') || prefix.endsWith('_')) {
      prefix = prefix.slice(0, -1);
    }
    switch (prefix) {
    case 'libdeflate-g':
      // provides libdeflate-gunzip and libdeflate-gzip
      return 'libdeflate';
    }
    if (prefix.length > 2) {
      return prefix
    }
  }
}
