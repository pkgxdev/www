# pkgx/www

This repo creates the websites for

1. https://pkgx.sh
2. https://pkgx.dev
3. https://pkgx.app
4. https://blog.pkgx.dev
5. https://mash.pkgx.sh

## How to dev

```sh
$ npm i
$ VITE_HOST=pkgx.sh npm run dev
# ^^ one of `pkgx.sh`, `pkgx.dev` or `pkgx.app` or `mash.pkgx.sh`
# there is no default! set one!

$ cd blog
$ hugo server --buildDrafts
```

## How to deploy

Pushing to `main` deploys all three. See `cd.yml` for details.

Note that pages in the React Router are handled by a CloudFront Function
on the CloudFront Distribution.


## Notes

* The “Shader” font’s license stipulates that it only be published to a CDN
  or web platform that we control so it is not committed to GitHub
