---
title: "tea 1.0.0-alpha.1 | tea.xyz"
description: 1.0.0-alpha.1 is a seminal release, we welcome feedback, especially from v0 early adopters.
date: 2023-09-11
categories: [open-source, web3]
tags: [web3 for open-source]
draft: false
featured_image: "/img/tea-release-cover-image.jpg"
---
![Featured Image](/img/tea-release-cover-image.jpg)

I have always practiced iterative development. I did it with <span class="orange tea codeword">brew</span> and every other open source project I’ve ever created and every job I’ve ever had (where I was allowed—Apple refused to let me :nerd_face:). I believe the only way to “find the fun”† in development is to try out your ideas and preferably with as large a community as possible. Thank you for your help in “finding the fun” with <span class="orange tea codeword">tea</span>. It’s been a very instructive process but now we’re ready for version one.

In this post we talk about what has changed and why. It is a complement to our <a class="docs-link" href="https://docs.tea.xyz/">full documentation</a> and the repo <span class="orange tea codeword">README</span>.

1.0.0-alpha.1 is a seminal release, we welcome feedback, especially from v0 early adopters.

<div class="indent ps-3">

 † the legendary developer Sid Meier described his iterative process when developing video games as “finding the fun”. Initially gameplay ideas might actually be tedious; if so; iterate until fun emerges.

</div>

## Magic
Most notably we have reconsidered “magic”.

Magic was an amazing feature but the truth is it didn’t suit terminals. tea’s magic would automatically fetch packages as you typed, even working with complex pipelines.

It had people say wow, but truthfully it was a little unnerving. Terminals are precise, magic was… unpredictable. As engineers we want to know precisely what is happening in our terminals and tea’s magic led to numerous situations where our users were “wow I love magic but wtf is going on with this command example?”

So now things are explicit—but we try to make running anything as frictionless as possible:

<div class="code-block p-4 mb-4">

```
$ node
^^ tea provides this, run it with `tea`

$ tea
tea +node && node

Welcome to Node.js v20.6.0.
Type ".help" for more information.
>
```
</div>

If you type something that your machine doesn’t have but tea has it we let you know and then you can just type <span class="orange tea codeword">tea</span>.

You can also just type <span class="orange tea codeword">t</span>.

## Shell Integration

In the above example typing <span class="orange tea codeword">tea</span> expands to <span class="orange tea codeword">tea +node && node</span> via our shell integration.

<div class="indent ps-3">

<span class="orange tea codeword">tea +node</span> adds node to the environment:

</div>

<div class="code-block p-4 mb-4">

```
$ tea +node
(+node) $ node --version
v20.1.2
```
</div>

<div class="indent ps-3">

<span class="orange tea codeword">(+node)</span> in your prompt indicates your terminal has been supplemented with, here, <span class="orange tea codeword">node</span>

</div>

You can keep adding packages:

<div class="code-block p-4 mb-4">

```
(+node) $ tea +cargo +c++
(+node+cargo+llvm.org) $ node --version; cargo --version; c++ --version
v20.1.2
cargo 1.72.1
clang version 14.0.3
```
</div>

Packages added this way are available for the session. They are gone when you <span class="orange tea codeword">exit</span>.

There was no direct way to do this in v0 though it was an idea we kept playing with because of how useful it can be to construct temporary environments that you then either commit (<span class="orange tea codeword">tea install</span>) or discard (<span class="orange tea codeword">exit</span>).

<div class="indent ps-3">

<a class="docs-link" href="https://docs.tea.xyz/shell-integration">docs.tea.xyz/shell-integration</a>

</div>

## Installing Packages

<div class="indent ps-3">

Yeah, yeah. You told us so… and you were right! 😏

</div>

We resisted adding an <span class="orange tea codeword">install</span> command for nine long months because we wanted to reinvent package management. We believe we now succeeded and after playing with the successor for a while we realized… sometimes you just need to install shit.

<div class="code-block p-4 mb-4">

```
$ tea +deno

(+deno) $ tea install
installed: ~/.local/bin/deno

$ cat ~/.local/bin/deno
#!/bin/sh
exec tea +deno.land -- deno "$@"
```

</div>

tea doesn’t really install anything—packages are only ever cached in <span class="orange tea codeword">~/.tea</span>—so it follows that installing things with tea is really just creating a stub script that runs the package via tea.

<div class="indent ps-3">

oh! btw: <span class="orange tea codeword">sudo tea install</span> will install to <span class="orange tea codeword">/usr/local/bin</span>

</div>

<div class="indent ps-3">

<a class="docs-link" href="https://docs.tea.xyz/tea-install">docs.tea.xyz/tea-install</a>

</div>

## pkg shortnames

While you could always have <span class="orange tea codeword">tea</span> run commands just by specifying them directly, eg. <span class="orange tea codeword">tea node</span>. For most other uses you would need to specify dependencies with the fully qualified names, eg. <span class="orange tea codeword">tea +nodejs.org@18 sh</span> you can now in all cases just specify commands (eg. <span class="orange tea codeword">tea +node@18 sh</span>).

In cases where multiple packages provide the same commands we require you to be more specific:

<div class="code-block p-4 mb-4">

```
$ tea yarn
error: multiple packages provide `yarn`, pls be more specific:

    tea +classic.yarnpkg.com yarn
    tea +yarnpkg.com yarn
```

</div>

Previously we allowed YAML front matter in scripts, but with support for shortnames the shebang syntax became much more concise and we decided that the YAML front matter, in fact, obscured intent. Thus we have dropped the feature; if you had something like:

<div class="code-block p-4 mb-4">

```
#!/usr/bin/env tea

#---
# args:
#    python
# dependencies:
#    git-scm.org: ^2
#    gnu.org/tar: '*'
#    python.org: ~3.11
#---

```
</div>

It can now be quite elegantly expressed instead as:

<div class="code-block p-4 mb-4">

#!/usr/bin/env -S tea +git@2 +tar python@3.11

</div>

While the YAML front matter is easier to read it required you and others who read your script to understand how <span class="orange tea codeword">tea</span> works and know about <span class="orange tea codeword">tea</span>. Shebangs are as old as UNIX and by encoding all the information there anyone who knows scripting can understand what is going on.

We really love UNIX and the UNIX philosophy and—with everything we do—seek to supplement its amazing base.

<div class="indent ps-3">

tea’s <span class="orange tea codeword">+pkg</span> syntax is now consistent across all usage. When using <span class="orange tea codeword">tea</span> as a runner you can add extra packages to instantiations of tools (super handy for eg. <span class="orange tea codeword">tea +openssl cargo build</span> ), as a shebang you can add all the packages you need during your script’s execution and with our shell-integration <span class="orange tea codeword">+pkg</span> syntax adds packages directly to your terminal session.

docs.tea.xyz/using-tea/running-anything
docs.tea.xyz/scripts
docs.tea.xyz/shell-integration

</div>

## Developer Environments
In v0 magic automatically loaded developer environments. This violated the principle of least surprise which (especially on the command line) made using <span class="orange tea codeword">tea</span> unpredictable. It also meant you were forced to use magic if you wanted developer environments and not all users wanted all parts of our magic.

The feature also had a secret binary operation. The shell hook that activated the developer environment could not take too long since it could randomly occur anytime you changed directory. Thus the packages in the environment might not actually be installed, instead <span class="orange tea codeword">tea</span> relied on the command not found handler (ie. the primary form of magic) to install the packages on first use. Which led to another problem with magic: it only works at the shell prompt and no deeper, ie. your <span class="orange tea codeword">Makefile</span> will just inexplicably fail to find the commands in your devenv.

So in v1 you must opt in to developer environments. It’s just as good a feature as before; we figure out the precise packages you need based on the keyfiles in your project and you can refine those dependency constraints to any versions you want using YAML front matter; it’s just now you have to explicitly turn it on on a per directory basis using a separate tool (that <span class="orange tea codeword">tea</span> can run) called <span class="orange tea codeword">dev</span>.

<div class="code-block p-4 mb-4">

```
$ cd myproj
myproj $ dev
found: deno.json, .git; tea +deno +git

(+deno+git) myproj $ tea status
+deno.land~1.33 +git-scm.org^2

(+deno+git) myproj $ deno --version
Deno 1.33.1

(+deno+git) myproj $ env | grep deno
PATH=~/.tea/deno.land/v1.33.1/bin:#…
# …

(+deno+git) myproj $ cd ..
tea -deno -git

$ deno --version
command not found: deno

# ^^ environments are only active inside their directories
```
</div>

<span class="orange tea codeword">dev</span> environments persist. *New terminal sessions will automatically load your <span class="orange tea codeword">dev</span> environments when you step into them.*

Making <span class="orange tea codeword">dev</span> a separate tool brings clarity to the scope of <span class="orange tea codeword">tea</span>. <span class="orange tea codeword">dev</span> is entirely built on top of <span class="orange tea codeword">tea</span> and the tea primitives. It leverages tea’s core features to create environments. You see this when you step into <span class="orange tea codeword">dev</span> environments since we output the calls we make, eg. <span class="orange tea codeword">tea +deno +git</span>.

<div class="indent ps-3">

This suite of features means the <span class="orange tea codeword">--env</span> and <span class="orange tea codeword">-E</span> flags have been dropped. These flags were confusing and tricky to use correctly, if you had a specific use that you don’t think is covered in v1 let us know and we’ll figure out what you or we should do about it.

</div>

<div class="indent ps-3">

<a class="docs-link" href="https://docs.tea.xyz/dev">docs.tea.xyz/dev</a>

</div>

## Endpoints

tea/gui added support for package “endpoints” in a recent release. Endpoints represent an idiomatic use of the package, for example, Stable Diffusion web UI’s endpoint launches the web UI on an available port and opens your browser to show it. tea/cli supports running these endpoints in a “Dockerlike” fashion:

<div class="code-block p-4 mb-4">

```
$ tea run stable-diffusion-webui
```

</div>

With some of our other local-AI packages we make sure to download models for you which the tool may otherwise leave as an exercise for the reader, eg.

<div class="code-block p-4 mb-4">

```
$ tea run llama.cpp
# ^^ grabs a compatible model and launches a chat TUI
```
</div>

<div class="indent ps-3">

<a class="docs-link" href="https://docs.tea.xyz/run">docs.tea.xyz/run</a>

</div>


## Dropped Features

### Symlinks to <span class="orange tea codeword">tea</span>
In v0 symlinks to <span class="orange tea codeword">tea</span> would act like the name of the symlink. While a neat feature it was too easy to create fork bombs with complex scripts or collections of <span class="orange tea codeword">tea</span> symlinks that were impossible to truly fix.

Stubs (which <span class="orange tea codeword">tea</span> install uses) are also more configurable allowing precise versioning of installed tools.

<div class="indent ps-3">

If you have a lot of symlinks to <span class="orange tea codeword">tea</span> currently then we apologize for the inconvenience. We appreciate your early adoptence!

</div>

<div class="indent ps-3">

Migration: <span class="orange tea codeword">tea install node</span>

</div>

### Magic

Magic was fun but ultimately had more problems than it was worth. The terminal is inherently a precise environment where you should be specific about your needs.

All the same if you want it back it’s one line of shell code:

<div class="code-block p-4 mb-4">

```
command_not_found_handler() { tea -- "$@" }
```
</div>

Magical developer environments also meant we couldn’t actually install the tools you needed when you entered project directories since this would make a simple <span class="orange tea codeword">
cd</span> operation potentially pause for minutes. Thus we relied on magic to instantiate commands initially giving us a situation where things may or may not be installed which meant your projects may or may not actually work. Hardly great DX.

### Supplemental Env Vars ($VERSION, $SRCROOT )

In the process of building <span class="orange tea codeword">
tea</span> we came to realize our true strength was making the entire open source ecosystem available to you. Open Source is a rich, treasure trove of tooling and there are better tools out there to get variables like these. <span class="orange tea codeword">
tea</span>’s scope has been tightened considerably and no longer provides these conveniences.

### <span class="orange tea codeword">README.md</span> as a Source of Dependency Data
If you used this we may bring it back, let us know. We still believe it is possible to have the README be both human readable and machine readable, but this feature was underused by the community and documenting it increased the perceived complexity of <span class="orange tea codeword">
tea</span> so we dropped it.

### Running Scripts via URL
UNIX tools do one thing and do it well. <span class="orange tea codeword">
curl</span> is damn good at loading data from URLs, has over 20 years of battle testing and is super configurable.

<div class="code-block p-4 mb-4">

```
curl foo.com/script.py | tea python@3.10
```
</div>

### Other Minor Changes
* punting through to the system with eg <span class="orange tea codeword">tea +node make</span>
  * Unpredictable, would tea run a system package or tea’s package?
  * If you still want to run system packages specify their full paths: tea <span class="orange tea codeword">+node /usr/bin/make</span>
    * this can be super useful, sometimes you need a system tool to have access to external packages
* <span class="orange tea codeword">tea +python.org node</span> used to be an error; we guessed that since you were specifying additional packages yourself that you didn’t want us to infer <span class="orange tea codeword">node</span>’s <span class="orange tea codeword">+pkg</span>. This now works.
* <span class="orange tea codeword">--env /-E</span> was a confusing flag that could lead to unexpected behaviors
* auto-symlinking installed tools to <span class="orange tea codeword">~/.tea/.local/bin</span> has been removed
  * this caused unexpected behavior and would screw up developer environments
  * <span class="orange tea codeword">tea install</span> is the new way to add tools to the system environment
* <span class="orange tea codeword">--dry-run</span> removed. We added this because tea/cli previously would look for tools in <span class="orange tea codeword">tea</span> and if it didn’t find them we would use a system tool (if available) and <span class="orange tea codeword">--dry-run</span> allowed you to figure out what was going on. Since you now must specify full paths if you want tea to use a system tool we have dropped this flag.
* Our shell integration doesn’t have support for fish or other alternate shells YET.
  * Please PR!
  * shell integration is quite a bit more complex now unfortunately…
* <span class="orange tea codeword">--json</span> — debatably useful, open ticket if you want it back

## FAQ

### How do I search for packages?
Type the command you want. If tea has it, it’ll say so.

If you need search that is more “waffley” then use the right tool for that job: a full web interface: <a class="docs-link">https://tea.xyz/+</a>

### How do I update packages?
Much like <span class="orange tea codeword">npx</span> or <span class="orange tea codeword">pipx</span>, <span class="orange tea codeword">tea</span> doesn’t “install” packages, we just cache them. However rather than go to the Internet whenever you type a command we just use whatever is already cached if it satisifies the constraints you specify. Thus we also support <span class="orange tea codeword">@latest</span> syntax:

<div class="code-block p-4 mb-4">

```
$ tea node@latest --version
```
</div>

To be consistent we allow you to invoke tea this way, which can lead to some amusing commands:

<div class="code-block p-4 mb-4">

```
$ tea@latest npx@latest cowsay@latest 'fancy a cuppa?'
 ________________
< fancy a cuppa? >
 ----------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

```
</div>

## Getting Started

<div class="code-block p-4 mb-4">

```
brew install teaxyz/pkgs/tea-cli
```
</div>

<a class="docs-link" href="https://docs.tea.xyz/installing-w/out-brew">docs.tea.xyz/installing-w/out-brew</a>

## A Thousand Tweaks

The 1.0.0-alpha release is a landmark for us here at tea.xyz. Thousands of tiny changes were implemented based on user feedback and 9 months of intensely using the tooling across many stacks and many platforms.

Let us know what you think. discussions-link-here
