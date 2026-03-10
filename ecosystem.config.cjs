module.exports = {
  apps: [{
    name: 'pkgx-dev-preview',
    script: 'npm',
    args: 'run dev -- --host 0.0.0.0',
    cwd: '/home/openclaw/pkgx-work/pkgxdev-www',
    env: {
      VITE_HOST: 'pkgx.dev',
      NODE_ENV: 'development'
    },
    autorestart: true,
    watch: false
  }]
};
