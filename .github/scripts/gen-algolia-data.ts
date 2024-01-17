#!/usr/bin/env -S pkgx deno run --allow-read=. --allow-net

import * as yaml from "https://deno.land/std@0.204.0/yaml/mod.ts";
import get_pkg_name from "./utils/get-name.ts"
import get_provides from "./utils/get-provides.ts"
import { basename } from "node:path";

interface Package {
  project: string
  description: string
  brief: string
  displayName: string
  programs: string[]
  objectID: string
}

export async function getKettleRemoteMetadata() {
  const headers = { Authorization: 'public' }
  const rsp = await fetch(`https://app.pkgx.dev/v1/packages/`, {headers})
  const data = await rsp.json() as (Package & { short_description: string })[]
  /// just pick out the fields we want
  return data.map(({ project, description, short_description }) => ({
    project, description, brief: short_description, objectID: project
  }))
}

function get_name(yml: any, project: string) {
  const provides = get_provides(yml)
  return get_pkg_name({ project, display_name: yml['display-name'], provides })
}


const rv = await getKettleRemoteMetadata()

for (const obj of rv as Package[]) {
  if (obj.project.startsWith('tea.xyz')) continue
  const yaml_path = `./projects/${obj.project}/package.yml`
  try {
    const txt = await Deno.readTextFileSync(yaml_path)
    const yml = await yaml.parse(txt) as Record<string, any>

    obj.displayName = get_name(yaml_path, obj.project)
    obj.programs = get_provides(yml).map(x => basename(x))
  } catch (err) {
    console.warn(`::warning::${err.message}`)
  }
}

console.log(JSON.stringify(rv, null, 2))

