---
title: "dev.diary—Finding the Fun"
date: 2023-01-23
categories: [dev.diaries, open-source]
tags: [open-source, homebrew, programming]
draft: false
featured_image: "/Images/blog/finding-the-fun.jpg"
---
When building any kind of product it takes a little time before you figure out its shape. Famous games developer Sid Meier described this process as “finding the fun”. He would iterate compulsively on his ideas until those little changes in the little details would uncover something sufficiently new and engaging that he had the basis for a new game.

![](https://miro.medium.com/v2/resize:fit:1024/1*Y25rtCmwlRMmcRlef-mlFA.png)

This is the approach I take with my products. From my childhood writing toys in BBC Basic, to working on the amaroK music player for KDE in the early 2000s, to making the Android version of TweetDeck in 2010, to how I approached making Homebrew and now with its spiritual successor: `tea`.

We released [tea/cli](https://github.com/teaxyz/cli) a couple months ago. At that point I felt the product was “ready enough” for general consumption. We had a number of compelling features coupled with a good mission statement and together to me that seemed enough to present it to the community and start gathering wider ideas and interest.

Which is a key differentiator between developing most products and developing open source: you bring your userbase in **_before_** you’ve “found the fun”.

Before launch I jokingly would say that _tea was not a package manager_. I was being flippant. But also I wasn't being flippant. Package Managers as a class of tool haven’t evolved since their inception in the 90s. They are very much in the what I call “egotistical tool” category: that being: you \*_will_\* learn how it works thank you very much because the package manager is a **very important tool** and you are lucky to have it. I’ve not a fan of this attitude.

I believe tools are a special class of utility. A well written tool completely eradicates entire classes of tedium enabling its users to reach new heights in productivity. A well written tool enables functionality that before was either too tricky to accomplish or completely impossible.

At launch we said `tea` was a universal interpreter, a universal environment manager, a unified dependency manager and it could run executable markdown.

[Changelog rightly called me out on this](https://changelog.com/news/491E), saying “might Max and the team be thinking _too_ big this time around?”

The truth is we hadn’t yet _quite_ found the fun.

Two months of passionate early adopter usage later and a few things were becoming apparent. tea’s real super powers were the underlying rethinking about the nature of package management, specifically that with tea the package manager disappeared. So I decided to experiment with doubling down on that.

At launch you could type `tea -X npm start`and tea would look for `npm` and run `start` , but if it didn’t find `npm` it would fetch it first. This was in fact a very near launch addition by me but it was a truly wonderful reduction in friction for using the open source ecosystem. And fundamentally what this feature said was: **the package manager needs to get out the way.**

> tea doesn’t _install packages_—at least not in a conventional sense. In the above example `npm` is not available unless you type `tea -X npm` otherwise it is “stowed” in `~/.tea` . This is important since I want using tea to complement your system. tea is not an operating system, it is a complement to whatever system (Mac, Linux, Windows, etc.) you are using.

Soon after a passionate early adopter of tea suggested that symlinks to tea should behave as though `tea -X foo bar` was called. So we implemented that and immediately it was apparent that this was a seriously cool feature. I used this to create a symlink from `tea` to `bpb` (a tool that makes signing your git commits _trivially easy_) and immediately knew that forever more I would not have to piss about for an hour getting my git-signing set up whenever it stopped working or a had to set myself up on a new machine, remote server or when clean installing my OS.

A developer at tea realized that you could make the shell’s command-not-found handler call `tea -X` . Command not found handlers have been used by the package manager before. For example, Ubuntu uses it to suggest packages that may satisfy whatever you typed. The idea made me laugh because it seemed so ill-advised! But we added it to the `README` as a hack that users may want to try out—_for fun_.

But I got to wondering… _had we in fact_ **_found the fun_**? I decided to add the command-not-found handler to my shell and see how I liked it.

After a few days I stopped laughing. I started getting excited. This hack wasn’t a hack. _It was awesome_. It completely delivered on tea’s promise and significantly simplified our narrative.

How do you use tea? You don’t. You use the tools that the open source ecosystem provides. If you read a blog post about a new tool then just type the commands you read into your Terminal and try it out. There’s no “figure out the package name and then install it step”. There’s no “will installing this break other stuff on my system” concerns. If you don’t like it then don’t worry about it—it’s already gone.

```
# want to see if bun will run your node project?$ bun run starttea: stowing bun^0.4bun: start$ which bunbun not found# ^^ it’s not in your PATH!$ bun --version0.4.0# ^^ but tea surfaces it for you
```

tea still is a “universal interpreter” but that just falls under the general banner; we don’t have to explicitly name this feature; tea just knows how to make what you throw at it work. Be that a command or a script, tea makes it possible for you to get on with what matters: making your app.

And so I dropped executable markdown completely. Part of the reason I added exe/md was the desire for tea to be a tool that makes development a dream. And we have achieved this because now if you want to use executable markdown to run the script `build` you just type `xc build` and tea installs [xc](https://github.com/joerdav/xc) transparently. Whatever “task runner” your project needs is transparently available. Having this feature in tea itself no longer made sense.

When it comes to making great products you need to be able to drop entire features without ego or the sunk-cost fallacy holding you back. What matters is the entire product vision no matter how cool you think something is. I still think exe/md is a cool idea, and didn’t know about `xc` before writing it. I’m very glad someone else thought the same and built it. UNIX tools should do one thing and one thing well.

**tea 0.19** lives up to the UNIX philosophy and thanks to Changelog for reminding me about that. I revisited every part of the CLI and retooled it towards this purpose. Check out the new README for the deets, the caveats and what comes next:

[https://github.com/teaxyz/cli](https://github.com/teaxyz/cli)
