import { ArrowUpRight } from "lucide-react";
import { Orange } from "../components/Terminal";

export default function Hero() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] p-4">
        <h1>
          <Orange><b>mash</b>—the package manager for scripts.</Orange>
        </h1>
        <p className="mt-2">
          Mash up millions of open source packages into monstrously powerful scripts.
        </p>
        <p className="mt-2">
          <i>Bash is ancient</i>. Write scripts in any language you want and trivially distribute them to the whole world.
        </p>
        <p className="text-sm mt-2">
          We're a community of thousands of passionate computer users who want to make the most of the fruits of open source software.
        </p>
      </div>

      <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] p-4">
        <h2 className="text-xs uppercase tracking-wider mb-2">Get Started</h2>
        <a
          href="https://github.com/pkgxdev/mash#installing-mash"
          target="github"
          className="inline-flex items-center gap-1 bg-[#4156E1] text-white px-4 py-2 rounded font-medium hover:bg-[#3348c4] transition-colors no-underline"
        >
          Install Mash <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] p-4">
        <h2 className="text-xs uppercase tracking-wider mb-2">Submitting Scripts</h2>
        <ol className="pl-4">
          <li><a href="https://github.com/pkgxdev/scripthub" className="text-[#4156E1] hover:underline">Fork</a></li>
          <li>Push scripts</li>
          <li>Wait an hour</li>
        </ol>
        <p className="text-sm mt-2">
          No pull request required! <i>We index the fork graph.</i>
        </p>
      </div>

      <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] p-4">
        <h2 className="text-xs uppercase tracking-wider mb-2">Improving This Website</h2>
        <p className="text-sm mt-2">
          Even this site is Open Source! If you have ideas for improving it, why not give it a go?{" "}
          <a href="https://github.com/pkgxdev/www" className="text-[#4156E1] hover:underline">
            github.com/pkgxdev/www
          </a>
        </p>
      </div>
    </div>
  );
}
