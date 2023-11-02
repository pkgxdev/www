#!/usr/bin/env -S pkgx deno run --allow-read --allow-write=./out

interface Pkg {
  name?: string
  project: string
  description: string
}

const pkgs: Pkg[] = JSON.parse(Deno.readTextFileSync("./out/index.json"));

for (const pkg of pkgs) {
  Deno.mkdirSync(`./out/${pkg.project}`, {recursive: true});
  let txt = Deno.readTextFileSync('./out/index.html');
  txt = replace(txt, 'title', pkg.name || pkg.project)
  txt = replace(txt, 'description', pkg.description)
  txt = replace(txt, 'image',  `https://gui.tea.xyz/prod/${project}/1024x1024.webp`)

  Deno.writeTextFileSync(`./out/${pkg.project}/index.html`, txt);
}

function replace(txt: string, attr: string, value: string) {
  return txt.replace(new RegExp(`<meta property="og:${attr}" content=".*">`), `<meta property="og:${attr}" content="${value}">`)
}
