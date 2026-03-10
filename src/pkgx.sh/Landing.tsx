import { ArrowRight } from "lucide-react";
import Terminal, { Dim, Orange, Prompt, Purple } from "../components/Terminal";
import { useIsMobile } from "../utils/useIsMobile";
import { cn } from "../utils/cn";

import charm from "../assets/wordmarks/charm.webp";
import node from "../assets/wordmarks/node.webp";
import openai from "../assets/wordmarks/OpenAI.svg";
import python from "../assets/wordmarks/python.webp";
import rust from "../assets/wordmarks/rust.svg";
import deno from "../assets/wordmarks/deno.svg";
import go from "../assets/wordmarks/go.webp";
import php from "../assets/wordmarks/php.svg";

function H3({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-center font-bold text-3xl", className)}>{children}</h2>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] p-4", className)}>
      {children}
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#4156E1]/10 border border-[#4156E1]/30 rounded p-3 text-sm mt-2">
      {children}
    </div>
  );
}

export function RunAnything() {
  return (
    <div className="space-y-6">
      <H3 className="mb-6">
        It's <code className="mr-0.5">npx</code> for{" "}
        <span className="text-[#4156E1] font-bold">everything else</span>
      </H3>

      <Terminal>
        <Prompt /> bun run<br />
        command not found: bun<br />
        <br />
        <Prompt /> <Orange>pkgx</Orange> bun run<br />
        <Dim>running `</Dim>bun run<Dim>`…</Dim><br />
        <br />
        Bun: a fast JavaScript runtime, package manager, bundler and test runner.<br />
        <Dim># …</Dim>
      </Terminal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <h4 className="text-lg font-semibold">Run Any Version</h4>
            <p className="text-[rgba(237,242,239,0.7)] my-3">
              node 16? python 2? postgres 12? <b>nps</b>.
            </p>
            <Terminal width="100%" mb={0} mt={2}>
              <Prompt /> <Orange>pkgx</Orange> node@16<br />
              Node.js v16.20.1<br />
              <Dim>&gt;</Dim>
            </Terminal>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold">Zero System Impact</h4>
            <p className="text-[rgba(237,242,239,0.7)] my-3">
              We don't install packages. <i>We cache them</i>. Just like <code>npx</code> caches & executes node packages,{" "}
              <code>pkgx</code> caches everything else (including <code>npx</code>).
            </p>
            <Terminal width="100%" mb={0} mt={2}>
              <Prompt /> <Orange>pkgx</Orange> rustc --version<br />
              rustc 1.72.1<br /><br />
              <Prompt /> which rustc<br />
              command not found: rustc<br />
              <Dim># ^^ <i>still</i> not installed!</Dim>
            </Terminal>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <h4 className="text-lg font-semibold">Whatever You Want To Run<br /><i>Just Type It</i></h4>
            <p className="text-[rgba(237,242,239,0.7)] my-3">
              <code>pkgx</code> can <i>optionally</i> integrate with your shell giving it <b>pkging powers</b>.
            </p>
            <p className="text-[rgba(237,242,239,0.7)] my-3">
              When our investors ask why this is cool we just shrug and say "do you even dev?".
            </p>
            <Terminal width="100%" mb={2} mt={2}>
              <Prompt /> deno<br />
              command not found: deno<br />
              <Dim>^^ type `</Dim>x<Dim>` to run that</Dim><br />
              <br />
              <Prompt /> <Orange>x</Orange><br />
              <Purple>env</Purple> +deno <Dim>&&</Dim> deno<br />
              <br />
              Deno 1.37.1<br />
              <Dim>&gt;</Dim>
            </Terminal>
            <InfoBox>
              <code>deno</code>'s not installed, <code>pkgx</code> just added it to your shell session. It'll be gone when you <code>exit</code> 🥹
            </InfoBox>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold">Or Just Install Stuff With <code>pkgm</code></h4>
            <Terminal width="100%" mb={2} mt={2}>
              <Prompt /> <Orange>pkgm</Orange> install gh<br />
              installed ~/.local/bin/gh<br />
            </Terminal>
            <InfoBox>
              Some tools you need at the system level, but generally we feel you should use our shell integration and our <Orange>dev</Orange> tool which makes tools available on a per project basis.
            </InfoBox>
          </Card>
        </div>
      </div>

      <p className="text-center">
        <a href="https://docs.pkgx.sh" className="inline-flex items-center gap-1 text-[#EDF2EF] hover:text-white no-underline transition-colors">
          Explore the docs <ArrowRight className="w-4 h-4" />
        </a>
      </p>
    </div>
  );
}

export function Quote() {
  const isxs = useIsMobile();
  return (
    <p className={cn("text-xl text-[rgba(237,242,239,0.7)] text-center mt-16", isxs ? "px-2" : "px-11")}>
      "Max Howell, the mind behind Homebrew, is shaking up the foundation of development once again with his new creation, <code>pkgx</code>"
    </p>
  );
}

export function RunAnywhere() {
  return (
    <div className="space-y-4 editors">
      <H3>
        Run <span className="text-[#4156E1] font-bold">Anywhere</span>
      </H3>
      <p className="text-xl text-[rgba(237,242,239,0.7)] text-center mb-8 mt-2">
        Wherever you work, <code>pkgx</code> works too.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <h4 className="text-lg font-semibold">macOS</h4>
          <ul className="text-[rgba(237,242,239,0.7)] mt-1 text-sm">
            <li>&gt;= 11</li>
            <li>Intel and Apple Silicon</li>
          </ul>
        </Card>
        <Card>
          <h4 className="text-lg font-semibold">Linux</h4>
          <ul className="text-[rgba(237,242,239,0.7)] mt-1 text-sm">
            <li>glibc &gt;=2.28</li>
            <li><code>x86_64</code> & <code>arm64</code></li>
          </ul>
        </Card>
        <Card>
          <h4 className="text-lg font-semibold">Windows</h4>
          <ul className="text-[rgba(237,242,239,0.7)] mt-1 text-sm">
            <li>WSL2</li>
            <li><i>Native coming soon!</i></li>
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7">
          <Card>
            <h4 className="text-lg font-semibold">Docker</h4>
            <p className="text-[rgba(237,242,239,0.7)] my-3 text-sm">
              Sure you could memorize the weird naming conventions of <code>apt</code>.
            </p>
            <p className="my-3">But wouldn't you rather <i>just run?</i></p>
            <Terminal width="100%" mb={0} mt={2}>
              <Purple>FROM</Purple> ubuntu<br />
              <Purple>RUN</Purple> curl https://pkgx.sh | sh<br />
              <Purple>RUN</Purple> pkgx python@3.12 -m http.server 8000
            </Terminal>
          </Card>
        </div>
        <div className="md:col-span-5">
          <Card className="h-full">
            <h4 className="text-lg font-semibold">CI/CD</h4>
            <Terminal width="100%" mb={0} mt={2}>
              - <Purple>uses</Purple>: pkgxdev/setup@v1<br />
              - <Purple>run</Purple>: pkgx npm@10 start
            </Terminal>
            <p className="text-right mt-4">
              <a href="https://docs.pkgx.sh/run-anywhere/ci-cd" className="inline-flex items-center gap-1 text-sm text-[rgba(237,242,239,0.7)] hover:text-[#EDF2EF] no-underline transition-colors">
                Other CI/CD Providers <ArrowRight className="w-3 h-3" />
              </a>
            </p>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">
          <Card>
            <h4 className="text-lg font-semibold">Editors</h4>
            <p className="text-[rgba(237,242,239,0.7)] my-3 text-sm">Just Works™ in VSCode? nps.</p>
            <p className="text-right mt-4">
              <a href="https://docs.pkgx.sh/run-anywhere/editors" className="inline-flex items-center gap-1 text-sm text-[rgba(237,242,239,0.7)] hover:text-[#EDF2EF] no-underline transition-colors">
                The Deets on That <ArrowRight className="w-3 h-3" />
              </a>
            </p>
          </Card>
        </div>
        <div className="md:col-span-8">
          <Card>
            <h4 className="text-lg font-semibold">Scripts</h4>
            <p className="text-[rgba(237,242,239,0.7)] my-3 text-sm">
              Isn't it time you had more than just Bash and POSIX in your scripts?
            </p>
            <p className="text-sm">We got you.</p>
            <Terminal width="100%" mb={0} mt={2}>
              <Dim>#!/usr/bin/env -S pkgx +gh +gum fish</Dim><br />
              <br />
              <Purple>if</Purple> gum confirm <Dim>"Are you sure you want to deploy?"</Dim><br />
              &nbsp;&nbsp;gh release create v1.0.0<br />
              <Purple>end</Purple><br />
            </Terminal>
          </Card>
        </div>
      </div>

      <p className="text-center">
        <a href="https://docs.pkgx.sh" className="inline-flex items-center gap-1 text-[#EDF2EF] hover:text-white no-underline transition-colors">
          Explore the docs <ArrowRight className="w-4 h-4" />
        </a>
      </p>
    </div>
  );
}

export function Dev() {
  const isxs = useIsMobile();
  const projects = [
    { img: charm, title: "Charm", alt: "Charm Logo" },
    { img: node, title: "Node.js", alt: "Node.js Logo" },
    { img: openai, title: "OpenAI", alt: "OpenAI Logo" },
    { img: python, title: "Python", alt: "Python Logo" },
    { img: rust, title: "Rust", alt: "Rust Logo" },
    { img: deno, title: "Deno", alt: "Deno Logo" },
    { img: go, title: "Go", alt: "Go Logo" },
    { img: php, title: "PHP", alt: "PHP Logo" },
  ];

  return (
    <div className={cn("space-y-4", isxs ? "space-y-2" : "space-y-6")}>
      <div className="space-y-2">
        <H3>
          The <span className="text-[#4156E1] font-bold">Foundation</span> of your Toolset
        </H3>
        <p className="text-xl text-[rgba(237,242,239,0.7)] text-center">
          The tools you need for work, where and when you need them.
        </p>
      </div>

      <Terminal>
        <Prompt /> cd myproj<br />
        <br />
        myproj <Prompt /> <Orange>dev</Orange><br />
        found cargo.toml, package.json; <Orange>env</Orange> +cargo +npm<br />
        <br />
        <Prompt /> cargo build<br />
        Compiling myproj v0.1.0<br />
        <Dim># …</Dim>
      </Terminal>

      <div className={cn("grid gap-5 md:gap-8 my-8 px-2", isxs ? "grid-cols-4" : "grid-cols-8")}>
        {projects.map((item) => (
          <div key={item.img}>
            <img src={item.img} title={item.title} alt={item.title} loading="lazy" className="w-full h-auto object-contain" />
          </div>
        ))}
      </div>

      <p className="text-right mt-4 text-sm">All the tools you need for work? Check.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h4 className="text-lg font-semibold">Developer Environments</h4>
          <p className="text-[rgba(237,242,239,0.7)] my-3">
            Developer environments provide the tools you need when working in those directories. When you step away—so do they.
          </p>
          <p className="text-right mt-4">
            <a href="https://docs.pkgx.sh/dev" className="inline-flex items-center gap-1 text-sm text-[rgba(237,242,239,0.7)] hover:text-[#EDF2EF] no-underline transition-colors">
              <code>dev</code> docs <ArrowRight className="w-3 h-3" />
            </a>
          </p>
        </Card>
        <div className="space-y-4">
          <Card>
            <h4 className="text-lg font-semibold">Reading your Keyfiles</h4>
            <p className="text-[rgba(237,242,239,0.7)] my-3">
              <code><Orange>dev</Orange></code> works by examining the <i>keyfiles</i> in your project root. If we see <code>cargo.toml</code> we know that means you want Rust.
            </p>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold">Constraining Your Dependencies</h4>
            <p className="text-[rgba(237,242,239,0.7)] my-3">
              You can constrain your dependencies to a specific version, or a range of versions by adding YAML front matter to your project keyfiles.
            </p>
            <p className="text-right mt-4">
              <a href="https://docs.pkgx.sh/dev" className="inline-flex items-center gap-1 text-sm text-[rgba(237,242,239,0.7)] hover:text-[#EDF2EF] no-underline transition-colors">
                Keyfile YAML Front Matter <ArrowRight className="w-3 h-3" />
              </a>
            </p>
          </Card>
        </div>
      </div>

      <p className="text-center">
        <a href="https://docs.pkgx.sh/dev" className="inline-flex items-center gap-1 text-[#EDF2EF] hover:text-white no-underline transition-colors">
          Explore the docs <ArrowRight className="w-4 h-4" />
        </a>
      </p>
    </div>
  );
}

export function Trusted() {
  return (
    <div className="space-y-2">
      <H3>
        Trusted by <span className="text-[#4156E1] font-bold">15k</span> Engineers
      </H3>
      <p className="text-xl text-[rgba(237,242,239,0.7)] text-center mt-2 mb-8">
        And built by them too.<br />
        <code>pkgx</code> is open source <span className="text-[#EDF2EF]">through and through</span>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h4 className="text-lg font-semibold">Packagers Who Care ❤️</h4>
          <p className="text-[rgba(237,242,239,0.7)] mt-2 mb-3 text-sm">We go the extra mile so you don't have to.</p>
          <ul className="text-[rgba(237,242,239,0.7)] mb-0 text-sm space-y-1">
            <li>Our <code>git</code> is configured to ignore <code>.DS_Store</code> files 😍</li>
            <li>We configure package managers to install to <code>~/.local/bin</code></li>
            <li>We codesign all our packages with both GPG and the platform code-signing engine</li>
            <li>We automatically install great git extensions like <code>git absorb</code> <i>when you type them</i></li>
            <li>We configure other version managers like <code>pyenv</code> to automatically install Pythons</li>
            <li>We build new releases almost immediately</li>
            <li>We add everything that people want. We love open source.</li>
          </ul>
        </Card>
        <div className="space-y-4">
          <Card>
            <h4 className="text-lg font-semibold">"The UNIX Philosophy" is in our DNA</h4>
            <p className="text-[rgba(237,242,239,0.7)] my-2">
              We study and preach it, worship and practice it. It's 100% who we are and <code>pkgx</code> is UNIX through and through.
            </p>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold">Open Source is in our DNA too</h4>
            <p className="text-[rgba(237,242,239,0.7)] my-2">
              Our founder, Max Howell, created Homebrew the package manager used by tens of millions of developers around the world.
            </p>
            <p className="text-[rgba(237,242,239,0.7)] my-4">He built it before.</p>
            <p className="text-[rgba(237,242,239,0.7)] mt-2">He's building it again.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
