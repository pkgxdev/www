import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../../utils/cn";

interface InstallSnippetsProps {
  project: string;
  provides?: string[];
}

type Tab = "pkgx" | "brew" | "other";

function detectOS(): string {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "macOS";
  if (ua.includes("win")) return "Windows";
  return "Linux";
}

export default function InstallSnippets({ project, provides }: InstallSnippetsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("pkgx");
  const [copied, setCopied] = useState(false);
  const os = detectOS();

  const pkgxCmd =
    provides?.length === 1
      ? `sh <(curl https://pkgx.sh) ${provides[0]}`
      : `sh <(curl https://pkgx.sh) +${project} -- $SHELL -i`;

  const pkgmCmd = `pkgm install ${project}`;

  const snippets: Record<Tab, { label: string; cmd: string; note?: string }> = {
    pkgx: {
      label: "pkgx",
      cmd: pkgxCmd,
      note: "Runs without installing. Caches automatically.",
    },
    brew: {
      label: "pkgm",
      cmd: pkgmCmd,
      note: "Installs to ~/.local/bin",
    },
    other: {
      label: os,
      cmd:
        os === "macOS"
          ? `brew install ${project.split("/").pop() || project}`
          : `# Check your distro's package manager for ${project}`,
      note: os === "macOS" ? "Homebrew (if available)" : "Varies by distribution",
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab].cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-[rgba(237,242,239,0.7)] uppercase tracking-wider">
        Install
      </h4>
      <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[rgba(149,178,184,0.2)]">
          {(Object.keys(snippets) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm border-b-2 bg-transparent cursor-pointer transition-colors",
                activeTab === tab
                  ? "border-[#4156E1] text-[#EDF2EF]"
                  : "border-transparent text-[rgba(237,242,239,0.5)] hover:text-[#EDF2EF]"
              )}
            >
              {snippets[tab].label}
            </button>
          ))}
        </div>
        {/* Code Block */}
        <div className="relative p-3">
          <code className="text-sm font-mono block pr-8 whitespace-pre-wrap break-all">
            {snippets[activeTab].cmd}
          </code>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1 rounded hover:bg-white/10 transition-colors bg-transparent border-0 cursor-pointer text-[rgba(237,242,239,0.5)]"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          {snippets[activeTab].note && (
            <p className="text-xs text-[rgba(237,242,239,0.4)] mt-2">{snippets[activeTab].note}</p>
          )}
        </div>
      </div>
    </div>
  );
}
