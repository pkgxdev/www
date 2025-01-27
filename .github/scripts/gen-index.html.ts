#!/usr/bin/env -S pkgx deno^1 run --allow-read --allow-write=./public/pkgs/

interface Pkg {
  name?: string
  project: string
  description: string
}

const pkgs: Pkg[] = JSON.parse(Deno.readTextFileSync("./public/pkgs/index.json"));

if (pkgs.length <= 0) {
  throw new Error("Empty pkgs!")
}

for (const pkg of pkgs) {
  Deno.mkdirSync(`./public/pkgs/${pkg.project}`, {recursive: true});

  const title = `${pkg.name || pkg.project} — pkgx`;

  let txt = Deno.readTextFileSync('./public/index.html');
  txt = replace(txt, 'title', title);
  txt = replace(txt, 'description', pkg.description);
  txt = replace(txt, 'image',  `https://pkgx.dev/pkgs/${pkg.project}.thumb.webp`);
  txt = replace(txt, 'url', `https://pkgx.dev/pkgs/${pkg.project}/`);

  txt = txt.replace(/<title>.*<\/title>/, `<title>${title}</title>`);

  // we want a small image, but many things (eg. Slack) then display NO image
  //txt = txt.replace('<meta name="twitter:card" content="summary_large_image" />', '<meta name="twitter:card" content="summary" />');

  Deno.writeTextFileSync(`./public/pkgs/${pkg.project}/index.html`, txt);

  console.log(`./public/pkgs/${pkg.project}/index.html`)
}

function replace(txt: string, attr: string, value: string) {
  for (const type of ['og', 'twitter']) {
    txt = txt.replace(
      new RegExp(`<meta property="${type}:${attr}" content=".*" />`),
      `<meta property="${type}:${attr}" content="${value}" />`);
  }
  return txt;
}
