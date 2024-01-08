import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      return html.replace(
        /<title>(.*?)<\/title>/,
        `<title>${title()}</title>`
      ).replace(
        /<meta property="og:title" content="(.*?)" \/>/,
        `<meta property="og:title" content="${title()}" />`
      ).replace(
        /<meta property="og:description" content="(.*?)" \/>/,
        `<meta property="og:description" content="${description()}" />`
      ).replace(
        /<meta name="description" content="(.*?)" \/>/,
        `<meta name="description" content="${description()}" />`
      )
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), htmlPlugin()],
});


function title() {
  switch (process.env.VITE_HOST) {
  case 'pkgx.sh':
    return 'Run Anything'
  case 'pkgx.dev':
    return 'pkgx, inc.'
  case 'mash.pkgx.sh':
    return 'mash — Monstrously Powerful Scripts'
  case 'pkgx.app':
    return 'The App Store for Open Source'
  }
}

function description() {
  switch (process.env.VITE_HOST) {
  case 'pkgx.sh':
    return 'pkgx is a blazingly fast, standalone, cross‐platform binary that runs anything'
  case 'pkgx.dev':
    return 'Crafters of fine Open Source products'
  case 'mash.pkgx.sh':
    return 'Mash up millions of Open Source packages into monstrously powerful scripts'
  case 'pkgx.app':
    return 'OPEN SOURCE IS A TREASURE TROVE. What jewel will you discover today?'
  }
}
