#!/usr/bin/env -S pkgx deno^1 run --allow-read=. --allow-net

import * as yaml from "https://deno.land/std@0.204.0/yaml/mod.ts";
import get_provides from "./utils/get-provides.ts"
import { basename } from "node:path";

export async function getKettleRemoteMetadata() {
  const json = JSON.parse(Deno.readTextFileSync('index.json'));
  return json.map((item: { description: string; project: string, name: string }) => {
    const { description, project, name } = item;
    return { brief: description, project, displayName: name };
  });
}

const rv = [] as Record<string, string>[];

for (const pkg of await getKettleRemoteMetadata()) {
  if (pkg.project.startsWith('tea.xyz')) {
    continue;
  }
  const yaml_path = `./projects/${pkg.project}/package.yml`
  try {
    const txt = await Deno.readTextFileSync(yaml_path)
    const yml = await yaml.parse(txt) as Record<string, any>

    pkg.programs = get_provides(yml).map(x => basename(x))
    pkg.objectID = pkg.project
  } catch (err) {
    console.warn(`::warning::${err.message}`)
  }

  rv.push(pkg);
}

const requests = rv.map(body => ({
  action: "addObject",
  body
}));

console.log(JSON.stringify({requests}))
