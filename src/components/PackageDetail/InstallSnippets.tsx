import { useState, useMemo, useCallback } from "react";
import { Copy, Check, Terminal, Box } from "lucide-react";
import { cn } from "../../utils/cn";

interface InstallSnippetsProps {
  project: string;
  provides?: string[];
}

interface SnippetTab {
  key: string;
  label: string;
  icon: "terminal" | "box";
  cmd: string;
  note: string;
}

function detectOS(): string {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "macOS";
  if (ua.includes("win")) return "Windows";
  return "Linux";
}

function buildTabs(project: string, provides: string[] | undefined, os: string): SnippetTab[] {
  const tabs: SnippetTab[] = [];

  // pkgx (always primary)
  const pkgxCmd =
    provides?.length === 1
      ? `sh <(curl https://pkgx.sh) ${provides[0]}`
      : `sh <(curl https://pkgx.sh) +${project} -- $SHELL -i`;

  tabs.push({
    key: "pkgx",
    label: "pkgx",
    icon: "terminal",
    cmd: pkgxCmd,
    note: "Runs without installing. Caches automatically.",
  });

  // pkgm (install permanently)
  tabs.push({
    key: "pkgm",
    label: "pkgm",
    icon: "terminal",
    cmd: `pkgm install ${project}`,
    note: "Installs to ~/.local/bin permanently.",
  });

  // Platform-specific
  const slug = project.split("/").pop() || project;

  if (os === "macOS") {
    tabs.push({
      key: "brew",
      label: "Homebrew",
      icon: "box",
      cmd: `brew install ${slug}`,
      note: "Homebrew (if formula available).",
    });
  } else if (os === "Linux") {
    tabs.push({
      key: "apt",
      label: "apt",
      icon: "box",
      cmd: `sudo apt install ${slug}`,
      note: "Debian/Ubuntu (if packaged).",
    });
  }

  // Docker (always offer)
  tabs.push({
    key: "docker",
    label: "Docker",
    icon: "box",
    cmd: `docker run --rm -it pkgxdev/pkgx ${provides?.length === 1 ? provides[0] : `+${project} -- sh`}`,
    note: "Run in a container. No local install needed.",
  });

  return tabs;
}

export default function InstallSnippets({ project, provides }: InstallSnippetsProps) {
  const os = useMemo(detectOS, []);
  const tabs = useMemo(() => buildTabs(project, provides, os), [project, provides, os]);
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [copied, setCopied] = useState(false);

  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0];

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentTab.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [currentTab.cmd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = tabs.findIndex((t) => t.key === activeTab);
      if (e.key === "ArrowRight" && idx < tabs.length - 1) {
        setActiveTab(tabs[idx + 1].key);
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && idx > 0) {
        setActiveTab(tabs[idx - 1].key);
        e.preventDefault();
      }
    },
    [activeTab, tabs]
  );

  return (
    <div className="space-y-2" role="region" aria-label="Installation methods">
      <h4 className="text-sm font-semibold text-[rgba(237,242,239,0.7)] uppercase tracking-wider">
        Install
      </h4>
      <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] overflow-hidden">
        {/* Tabs */}
        <div
          className="flex border-b border-[rgba(149,178,184,0.2)] overflow-x-auto"
          role="tablist"
          aria-label="Install methods"
          onKeyDown={handleKeyDown}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const IconComponent = tab.icon === "terminal" ? Terminal : Box;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                id={`install-tab-${tab.key}`}
                aria-selected={isActive}
                aria-controls={`install-panel-${tab.key}`}
                tabIndex={isActive ? 0 : -1}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 bg-transparent cursor-pointer transition-colors whitespace-nowrap shrink-0",
                  isActive
                    ? "border-[#4156E1] text-[#EDF2EF]"
                    : "border-transparent text-[rgba(237,242,239,0.4)] hover:text-[rgba(237,242,239,0.7)]"
                )}
              >
                <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
                {tab.label}
                {tab.key === "pkgx" && (
                  <span className="text-[0.55rem] px-1 py-px rounded bg-[#4156E1]/20 text-[#4156E1] border border-[#4156E1]/30 uppercase">
                    recommended
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Code Block */}
        <div
          role="tabpanel"
          id={`install-panel-${currentTab.key}`}
          aria-labelledby={`install-tab-${currentTab.key}`}
          className="relative p-4"
        >
          <div className="flex items-start gap-2">
            <span className="text-[#4156E1] font-mono text-sm select-none shrink-0" aria-hidden="true">
              $
            </span>
            <code className="text-sm font-mono block pr-10 whitespace-pre-wrap break-all flex-1 select-all">
              {currentTab.cmd}
            </code>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={cn(
              "absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded text-xs transition-all bg-transparent border cursor-pointer",
              copied
                ? "border-green-500/40 text-green-400 bg-green-500/10"
                : "border-[rgba(149,178,184,0.2)] text-[rgba(237,242,239,0.5)] hover:bg-white/5 hover:text-[#EDF2EF]"
            )}
            title="Copy to clipboard"
            aria-label={copied ? "Copied!" : "Copy install command"}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Note */}
          {currentTab.note && (
            <p className="text-xs text-[rgba(237,242,239,0.4)] mt-3 pt-2 border-t border-[rgba(149,178,184,0.1)]">
              {currentTab.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
