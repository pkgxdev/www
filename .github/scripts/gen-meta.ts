#!/usr/bin/env -S pkgx deno^2 run --allow-net --allow-write=./out --allow-read --unstable-kv --allow-env --allow-run

//TODO if no homepage at the end check of it all check the project name for a 200 HEAD request
//TODO if no github check if project name is a github


import { plumbing } from "https://deno.land/x/libpkgx@v0.20.3/mod.ts";
import { fromFileUrl, dirname, join } from "jsr:@std/path@^1.0.8";
import { ensureDirSync, exists } from "jsr:@std/fs"
import { existsSync } from "node:fs";
import usePantry from "https://deno.land/x/libpkgx@v0.20.3/src/hooks/usePantry.ts";

const kv = await Deno.openKv();
const { which } = plumbing;

const out = join(dirname(fromFileUrl(import.meta.url)), '../../out');
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

  const {name, versions: {stable}, revision, desc: description, homepage, license, bottle: {stable: {rebuild}}, urls: {head}, ruby_source_path} = obj;

  if (got.has(name) || name.includes("@")) {
    continue
  }

  console.error('processing:', name);

  const {manifests, version} = await get_manifest(obj);
  if (!manifests) continue;

  for (const manifest of manifests) {
    const brew_url = `https://formulae.brew.sh/formula/${name}`;
    const brew_rb_url = `https://github.com/Homebrew/homebrew-core/blob/main/${ruby_source_path}`;
    const github = try_github(head, homepage)
    kv.set(['formula', name], {version, description, homepage, license, brew_url, brew_rb_url, github});

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

for await (const { project } of usePantry().ls()) {
  const foo = await usePantry().project(project)
  const provides = await foo.provides();
  if (provides.length == 0) {

    //TODO

  } else for (const provide of provides) {
    const bar = await kv.get(['provides', `bin/${provide}`])
    const baz = (bar.value as { ff: string[] } | null)?.ff;
    if (!baz) {
      console.error("failed to map", project, provide);
    } else if (baz.length == 1) {
      let { homepage, description, provides, brew_url, license, github } = (await kv.get(["formula", baz[0]])).value as any;
      let gh_description: string | undefined = undefined;

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

      let json = {
        brief, description, homepage, provides, brew_url, license, github
      }
      const fn = join(out, `${project}.json`);
      ensureDirSync(dirname(fn));
      Deno.writeTextFileSync(fn, JSON.stringify(json, null, 2));
      break;
    }
  }
}

async function get_formula_json() {
  const headers: Record<string, string> = {};
  try {
    if (existsSync(join(out, 'formula.json'))) {
      headers["If-None-Match"] = Deno.readTextFileSync(join(out, '.git/formula.json.ETAG'));
    }
  } catch {}

  // send the contents of out/ETAG as the If-None-Match header
  const rsp = await fetch("https://formulae.brew.sh/api/formula.json", {headers});

  if (rsp.status == 304) {
    const data = Deno.readFileSync(join(out, ".git/formula.json"));
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
    Deno.writeTextFileSync(join(out, 'ETAG'), etag);
    Deno.writeTextFileSync(join(out, 'formula.json'), JSON.stringify(json));
  }

  return json
}

async function get_manifest({name, versions: {stable}, revision, desc: description, homepage, license, bottle: {stable: {rebuild}}, head, ruby_source_path}: any) {
  const version = typeof stable == 'string' ? stable : {stable}

  //TODO check age is less than 3 hours, then do ETAG check
  if (existsSync(join(out, `.git/${name}-manifests.json`))) {
    const data = Deno.readFileSync(join(out, `.git/${name}-manifests.json`));
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
    if (existsSync(join(out, 'formula.json'))) {
      headers["If-None-Match"] = Deno.readTextFileSync(join(out, `.git/${name}-manifests.json.ETAG`));
    }
  } catch {}

  //TODO no auth token I have tried works but that would get us better rate limits
  const rsp = await fetch(url, { headers });

  if (rsp.status == 304) {
    const data = Deno.readFileSync(join(out, `.git/${name}-manifests.json`));
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
    Deno.writeTextFileSync(join(out, `.git/${name}-manifests.json.ETAG`), etag);
    Deno.writeTextFileSync(join(out, `.git/${name}-manifests.json`), JSON.stringify(json));
  }

  // we have no github auth so we can only request 20 times a second at most
  await new Promise(resolve => setTimeout(resolve, 20));

  return { ...json, version };
}

function try_github(head: { url: string } | null, homepage: string) {
  let rv = get();
  if (rv?.endsWith('.git')) {
    rv = rv.slice(0, -4);
  }
  return rv;


  function get() {
    if (/github.com\//.test(homepage)) {
      return homepage;
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