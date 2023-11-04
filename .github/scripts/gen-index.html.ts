#!/usr/bin/env -S pkgx deno run --allow-read --allow-write=./out

interface Pkg {
  name?: string
  project: string
  description: string
}

const pkgs: Pkg[] = JSON.parse(Deno.readTextFileSync("./out/index.json"));

if (pkgs.length <= 0) {
  throw new Error("Empty pkgs!")
}

for (const pkg of pkgs) {
  Deno.mkdirSync(`./out/${pkg.project}`, {recursive: true});

  const title = `${pkg.name || pkg.project} — pkgx`;

  let txt = Deno.readTextFileSync('./out/index.html');
  txt = replace(txt, 'title', title);
  txt = replace(txt, 'description', pkg.description);
  txt = replace(txt, 'image',  `https://gui.tea.xyz/prod/${pkg.project}/1024x1024.webp`);
  txt = replace(txt, 'url', `https://pkgx.dev/pkgs/${pkg.project}/`);

  txt = txt.replace(/<title>.*<\/title>/, `<title>${title}</title>`);

  txt = txt.replace('<meta name="twitter:card" content="summary_large_image" />', '<meta name="twitter:card" content="summary" />');

  Deno.writeTextFileSync(`./out/${pkg.project}/index.html`, txt);

  console.log(`./out/${pkg.project}/index.html`)
}

function replace(txt: string, attr: string, value: string) {
  return txt.replace(new RegExp(`<meta property="og:${attr}" content=".*" />`), `<meta property="og:${attr}" content="${value}" />`);
}
