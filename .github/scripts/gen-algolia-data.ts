#!/usr/bin/env -S pkgx deno run --allow-read=. --allow-net

import * as yaml from "https://deno.land/std@0.204.0/yaml/mod.ts";
import { isArray, isString } from "https://deno.land/x/is_what@v4.1.15/src/index.ts";
import get_pkg_name from "./utils/get-name.ts"

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
  return get_pkg_name({ project, display_name: yml['display-name'], provides: yml['provides'] })
}


const rv = await getKettleRemoteMetadata()

for (const obj of rv as Package[]) {
  const yaml_path = `./projects/${obj.project}/package.yml`
  const txt = await Deno.readTextFileSync(yaml_path)
  const yml = await yaml.parse(txt) as Record<string, any>

  const node = yml['provides']
  const provides: string[] = isArray(node) ? node : isString(node) ? [node] : []

  obj.displayName = get_name(yaml_path, obj.project)
  obj.programs = provides.map(x => x.slice(4))
}

console.log(JSON.stringify(rv, null, 2))

