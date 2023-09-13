---
title: "dev_diary: pkgx is env++"
date: 2023-01-31
categories: [dev.diaries, programming]
draft: false
featured_image: "/img/pkgx-is-env.jpg"
---

A few aspects of the shape of pkgx’s CLI have been bothering me.

While building out the pre-release pkgx began to take shape as a “universal interpreter”. I have long thought package managers were depressingly basic in operation, a strange thing for such a (potentially) powerful part of the stack. It seemed somehow backwards that if I obtain a script, I first must figure out what package runs it, and then possibly even install a bunch of dependencies in order for it to run. Why can’t the package manager figure this stuff out for you? And thus `pkgx script.ext` did just that.

![](https://miro.medium.com/v2/resize:fit:1000/1*7F_695_rMJ8JNn7Sa_pR9g.jpeg)

want [https://charm.sh](https://charm.sh/)’s amazing vhs terminal recorder? Just type \`vhs\`

While iterating around this I realized that it wasn’t laziness that was holding me back from implementing `pkgx install` , it was a desire to find something _better;_ a better paradigm for using open source; a better paradigm than _managing it_. So I held off. My coworkers complained that they still needed `brew` even though we were building its spiritual successor.

Yet I held off because I know that if I make parts of my workflow tedious, I will come up with a solution. I suffer a little now to reap the rewards later.

I would joke with people that “pkgx wasn’t a package manager”. This was tongue in cheek—of course pkgx was and is a package manager. But it didn’t seem much like one. I wanted people to stop thinking about the package manager altogether. I wanted to make something where managing packages stops being a part of your workflow at all. You have apps to build, and I want you to build them with tools like mine getting out of your way entirely.

In pursuit of being a universal interpreter without installing packages one must build environments that create a kind of container for the software. It seemed useful to make those environments available more generally.

With `pkgx` you build an environment by _adding packages_ with `+pkg.com` syntax. With the environment assembled you then execute a command. Plus package syntax was a wonderful discovery allowing entirely new categories of workflows.

What was pkgx? It seemed to have become a tool for assembling environments of open source software which you then apply to other tooling. If we can figure out those environments for you, we do, if we cannot we need you to tell us.

_pkgx was a_ _universal interpreter_. So I looked to other interpreters to see if the similarities should go further.

It’s typical with interpreters for just typing them to start a REPL (a [read eval print loop](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)). You exchange your Bash prompt for a Python, Ruby, etc. prompt. Should pkgx do this? We tried it, so `pkgx +deno.land` would start a new shell with `deno` available. It was somewhat a good feature and it was idiomatic with the concept that pkgx was a kind of interpreter.

But something about it irked me.

pkgx described itself as a unified package manager, a universal interpreter, a universal environment manager. It was all these things, but you can’t sell a product if you can’t put your finger on what the product _\*is\*_.

[Last week](https://blog.pkgx.dev/dev_diary-finding-the-fun) I talked about how we resolved the messaging by more clearly seeing what pkgx was. pkgx is a magical package manager, it’s _invisible and powerful_. Stop thinking about installing stuff—get on with your work instead. If you don’t need to even think about managing packages entirely you can use new tools and workflows effortlessly, but also other people who make tools, scripts or workflows can know you, the end user for their efforts, have the entire open source ecosystem at your fingertips too. They don’t need to tell you how to install a bunch of stuff, with a bunch of different versions, for a bunch of different platforms in their README—you have pkgx.

This week I realized that during the history of UNIX there was another innovation in this area. As developers for UNIX like systems exploded, new tools began to appear all over. Each UNIX had different conventions and preferences for where such tools may be installed. This would be problematic for the **_shebang_**.

## Shebangs

Perl was one of the first interpreted languages. It grabbed the minds of all UNIX users since it was fast to dev like shell scripting but powerful like “proper” languages (eg. C). It supported being “shebanged”, the `#!` at the front of a text file that told your shell who interprets the file you want it to run:

```
#!/usr/bin/perl
```

The problem is: perl was new and not POSIX with an associated “this is where it should be installed” path. It might be installed anywhere! Shebangs were not designed to search `PATH` (for security reasons presumably) but this impeded the possibility of distributing a perl script to other communities.

So`/usr/bin/env` was built. It was designed to construct environments† and then execute commands inside those environments searching the specified `PATH` for the command to run. POSIX declared its path to be `/usr/bin/env` so now shebangs could be:

```
#!/usr/bin/env perl
```

Thus alleviating the location problem.

However the user still needed to install `perl` themselves.

> † though not commonly used `env FOO=bar baz` and other environment management features are a primary part of `env`’s CLI.

## `pkgx` is env++

```
#!/usr/bin/env -S pkgx perl## see `man env` to understand the `-S`
```

Like `env` we construct an environment for `perl` and run it, but as supplemental functionality we install `perl` and its dependencies first.

One day perhaps we’ll be POSIX and we can reduce this to:

```
#!/usr/bin/pkgx perl
```

One can only dream…

## Adapting `pkgx` Based on this Realization

pkgx is a more capable `env`. Should this be something we document? Should this adapt how we introduce it and talk about it? I began exploring that.

Firstly, our REPL like feature `pkgx +rust-lang.org` starts a new shell that contains the environment for rust. Should instead we output the environment like `env` does?

I tried it and it felt right. We already use this functionality for pkgx’s magic, so now instead of that being a special mode it was a idiomatic use of `pkgx` as a CLI.

However the REPL functionality is neat, so do we really dare lose it?

Fortuantely an idiomatic way to do the REPL presented itself to me, simply append `sh`, eg. `pkgx +rust-lang.org sh`. This is all our REPL was doing underneath anyway. Now pkgx doesn’t have any special modes, we are communicating to the user intuitively that pkgx installs packages, creates environments and executes commands within them. To see the environment that will be created, stop typing (eg `pkgx +rust-lang.org`). To use the environment, add commands.

Typing `pkgx` by itself dumps the current supplemented environment. If you have our magic installed then inside a developer environment you can see what pkgx did to create that environment.

I’m super happy with these changes as now I feel pkgx is close to being very well scoped, intuitive to understand, composable, flexible and useful to many different tasks along the lines of its utility proposition. _We are both more powerful than all other package managers while also being more intuitive._

I foresee a v1 in the near future.

## Breaking Change

This is a breaking change, but we are pre v1. After v1 we will not break the CLI API unless we bump the major version.
