# AGENTS: www

Public frontend repository for pkgx web properties.

## Core Commands

- `npm ci`
- `npm run build`
- `VITE_HOST=pkgx.dev npm run dev`

## Always Do

- Keep route behavior and static asset assumptions stable.
- Prefer component-level changes with focused tests where possible.

## Ask First

- Build/deploy pipeline changes.
- Content/security policy changes affecting multiple hosts.

## Never Do

- Never ship changes that only pass local dev and fail production build.
- Never add internal-only information to public web content.
