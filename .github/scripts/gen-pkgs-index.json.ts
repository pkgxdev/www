#!/usr/bin/env -S pkgx deno^1 run -A

import * as fs from "node:fs"

interface Package {
  project: string,
  birthtime: Date,
  name?: string
  description?: string
  labels?: string[]
}

export async function getKettleRemoteMetadata() {
  const map: Record<string, string> = {};

  const walk = async (dir: string) => {
    for await (const d of Deno.readDir(dir)) {
      const entry = `${dir}/${d.name}`;
      if (d.isDirectory) {
        await walk(entry);
      } else if (d.isFile && entry.endsWith('.json')) {
        const json = JSON.parse(Deno.readTextFileSync(entry));
        const project = entry.slice(12, -5);
        map[project] = json.brief || json.description;
      }
    }
  };

  await walk('../gh-pages');

  return map;
}

const descriptions = await getKettleRemoteMetadata();

async function getPackageYmlCreationDates(): Promise<Package[]> {
  const cmdString = "git log --pretty=format:'%H %aI' --name-only --diff-filter=ACMR -- 'projects/**/package.yml'";
  const process = Deno.run({
    cmd: ["bash", "-c", cmdString],
    stdout: "piped",
  });

  const output = new TextDecoder().decode(await process.output());
  await process.status();
  process.close();

  const projects = new Set();
  const lines = output.trim().split('\n');
  const rv: Record<string, Package> = {}
  let currentCommitDate: string | null = null;

  for (const line of lines) {
    if (line.includes(' ')) {  // Detect lines with commit hash and date
      currentCommitDate = line.split(' ')[1];
    } else if (line.endsWith('package.yml')) {
      const project = line.slice(9, -12)

      if (!fs.existsSync(line) || project.startsWith('tea.xyz')) {
        // the file used to exist but has been deleted
        console.warn("::warning::skipping yanked:", project)
        continue
      }

      const birthtime = new Date(currentCommitDate!)
      const name = await get_name(line, project)

      let description: string | undefined = descriptions[project]?.trim()
      if (!description) description = undefined

      let labels: string[] | undefined = [...await get_labels(line)]
      if (labels.length == 0) labels = undefined


      rv[project] = { project, birthtime, name, description, labels };
    }
  }

  return Object.values(rv);
}

const pkgs = await getPackageYmlCreationDates();

// sort by birthtime
pkgs.sort((a, b) => b.birthtime.getTime() - a.birthtime.getTime());

console.log(JSON.stringify(pkgs));

//////////////////////////////////////////////////////
import { parse } from "https://deno.land/std@0.204.0/yaml/mod.ts";
import get_provides from "./utils/get-provides.ts";
import get_pkg_name from "./utils/get-name.ts";

async function get_name(path: string, project: string): Promise<string | undefined> {
  const txt = await Deno.readTextFileSync(path)
  const yml = await parse(txt) as Record<string, any>
  const provides = get_provides(yml)
  return get_pkg_name({ project, display_name: yml['display-name'], provides })
}

import { parse_pkgs_node } from "https://deno.land/x/libpkgx@v0.15.1/src/hooks/usePantry.ts"
import { dirname } from "node:path";

async function get_labels(path: string) {
  const txt = await Deno.readTextFileSync(path)
  const yml = await parse(txt) as Record<string, any>
  const deps = parse_pkgs_node(yml.dependencies) //NOTE will ignore other platforms than linux, but should be fine

  const labels = new Set<string>(deps.compact(({ project }) => {
    switch (project) {
    case 'nodejs.org':
    case 'npmjs.com':
      return 'node'
    case 'python.org':
    case 'pip.pypa.io':
      return 'python'
    case 'ruby-lang.org':
    case 'rubygems.org':
      return 'ruby'
    case 'rust-lang.org':
    case 'rust-lang.org/cargo':
      return 'rust'
    }
  }))

  if (yml.build?.dependencies) for (const dep of parse_pkgs_node(yml.build.dependencies)) {
    switch (dep.project) {
    case 'rust-lang.org':
    case 'rust-lang.org/cargo':
      labels.add('rust')
      break
    case 'go.dev':
      labels.add('go')
    }
  }

  return labels
}
