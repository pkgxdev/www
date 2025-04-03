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
      ).replace(
        /<script><\/script>/,
        scripts()
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
    return 'mash — The Package Manager for Scripts'
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

function scripts() {
  switch (process.env.VITE_HOST) {
  case 'pkgx.dev':
    return `<script>
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1632217704843931');
    fbq('track', 'PageView');
</script>
<noscript>
    <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=1632217704843931&ev=PageView&noscript=1" />
</noscript>`;
  default: return '';
  }
}