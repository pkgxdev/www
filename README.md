# pkgx/www

This repo creates the websites for

1. https://pkgx.sh
2. https://pkgx.dev
3. https://pkgx.app
4. https://blog.pkgx.dev

## How to dev

```sh
$ VITE_PKGX_TLD=sh npm run dev
# ^^ tld can be `sh`, `dev` or `app`

$ cd blog
$ hugo server --buildDrafts
```

## How to deploy

Pushing to `main` deploys all three. See `cd.yml` for details.

Note that pages in the React Router are handled by a CloudFront Function
on the CloudFront Distribution.
