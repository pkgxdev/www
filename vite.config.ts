import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteImagemin from 'vite-plugin-imagemin';

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
  plugins: [
    tailwindcss(),
    react(),
    htmlPlugin(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 85 },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: false }
        ]
      },
      webp: { quality: 85 }
    })
  ],
  optimizeDeps: {
    // Pre-include ALL deps to prevent second-pass discovery race condition
    // This eliminates the "chunk-REFQX4J5.js missing" error
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      'react-helmet',
      'react-infinite-scroll-hook',
      'react-use',
      'lucide-react',
      '@aws-sdk/client-s3',
      'is-what',
      'yaml',
      'clsx',
      'tailwind-merge',
      'showdown',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunk (React + Router)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // AWS SDK (only used in PackageListing)
          'vendor-aws': ['@aws-sdk/client-s3'],
          // UI utilities
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge', 'class-variance-authority'],
          // Data utilities
          'vendor-utils': ['yaml', 'showdown', 'is-what', 'react-use', 'react-helmet', 'react-infinite-scroll-hook'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
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
    return `<!-- meta pixel -->
<script>
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
</noscript>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-FHTCBX27VL"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-FHTCBX27VL');
</script>`;
  default: return '';
  }
}
