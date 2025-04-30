#!/usr/bin/env -S pkgx deno^1 run -A --unstable

import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts"
import FeedItem from "../../src/utils/FeedItem.ts"

const { options: { pkgsJson, pantryPath, blogPath, scripthubJson } } = await new Command()
  .option("--blog-path <path>", "a", { required: true })
  .option("--scripthub-json <path>", "b", { required: true })
  .option("--pkgs-json <path>", "c", { required: true })
  .option("--pantry-path <path>", "d", { required: true })
  .parse(Deno.args)

const rv: FeedItem[] = []

import { parse } from "https://deno.land/std@0.204.0/yaml/mod.ts";

for (const pkg of JSON.parse(Deno.readTextFileSync(pkgsJson))) {
  const { project, name, description, birthtime } = pkg
  const txt = await Deno.readTextFileSync(`${pantryPath}/projects/${project}/package.yml`)
  const yml = await parse(txt) as Record<string, any>
  if (yml.provides?.length) {
    rv.push({
      type: 'pkg',
      title: name ?? project,
      description,
      time: new Date(birthtime),
      image: `https://pkgx.dev/pkgs/${project}.thumb.webp`,
      url: `https://pkgx.dev/pkgs/${project}/`
    })
  }
}

import { extract } from "https://deno.land/std@0.206.0/front_matter/any.ts";
import { describe } from "node:test";

for (const {name, isFile} of Deno.readDirSync(`./blog/content`)) {
  if (!isFile || !name.endsWith(".md")) continue
  const txt = await Deno.readTextFileSync(`${blogPath}/content/${name}`)
  const { date, description, title, featured_image } = await parse(extract(txt).frontMatter)

  const slug = title.replace(/[^a-zA-Z0-9]/g, '-')

  rv.push({
    type: 'blog',
    time: new Date(date),
    description,
    title,
    image: `https://blog.pkgx.dev${featured_image}`,
    url: `https://blog.pkgx.dev/${slug}`,
  })
}

for (const script of JSON.parse(Deno.readTextFileSync(scripthubJson)).scripts) {
  const { cmd, fullname, description, birthtime, avatar } = script
  const url = `https://mash.pkgx.sh/${fullname}`
  if (description) rv.push({
    type: 'mash',
    time: new Date(birthtime),
    description: demarkdown(description),
    title: cmd,
    image: avatar,
    url
  })
}

rv.sort((a, b) => b.time.getTime() - a.time.getTime())

console.log(JSON.stringify(rv))

function demarkdown(input: string): string {
  let sentences = input.split('.').filter(x => x);
  if (sentences.length > 1) {
    input = sentences[0] + '.'
  }
  return input.replaceAll(/\[([^\]]+?)\]\(([^\)]+?)\)/g, '$1');
}
