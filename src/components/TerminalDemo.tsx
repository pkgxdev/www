import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "../utils/useIsMobile";
import { cn } from "../utils/cn";
import { Copy, Check, Play, Pause, RotateCcw } from "lucide-react";

/* ─── Command Sequence ─── */

interface CommandStep {
  command: string;
  output: string[];
}

const DEMO_SEQUENCE: CommandStep[] = [
  {
    command: "pkgx python@3.12",
    output: ["✓ python 3.12.1 installed"],
  },
  {
    command: "python --version",
    output: ["Python 3.12.1"],
  },
  {
    command: "pkgx node@20 npm@latest",
    output: ["✓ node 20.11.0 installed", "✓ npm 10.4.0 installed"],
  },
  {
    command: "node --version",
    output: ["v20.11.0"],
  },
];

/* ─── Timing Constants ─── */

const CHAR_DELAY_MIN = 55;
const CHAR_DELAY_MAX = 85;
const PAUSE_AFTER_TYPING = 400;
const PAUSE_AFTER_OUTPUT = 1600;
const PAUSE_BEFORE_RESTART = 2400;

function randomTypingDelay() {
  return CHAR_DELAY_MIN + Math.random() * (CHAR_DELAY_MAX - CHAR_DELAY_MIN);
}

/* ─── useClipboard Hook ─── */

function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), timeout);
      } catch {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), timeout);
      }
    },
    [timeout]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { copied, copy };
}

/* ─── useTerminalAnimation Hook ─── */

type AnimPhase = "typing" | "showing-output" | "pausing" | "done";

interface AnimState {
  /** Index of the current step in the sequence */
  stepIndex: number;
  /** Characters revealed so far in the current command */
  charsTyped: number;
  /** Whether output lines for the current step are visible */
  outputVisible: boolean;
  /** All completed lines (commands + outputs) for history */
  history: Array<{ type: "command" | "output"; text: string }>;
  /** Current animation phase */
  phase: AnimPhase;
}

function useTerminalAnimation(steps: CommandStep[]) {
  const [state, setState] = useState<AnimState>({
    stepIndex: 0,
    charsTyped: 0,
    outputVisible: false,
    history: [],
    phase: "typing",
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const prefersReduced = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect reduced-motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      prefersReduced.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }
  }, []);

  // Show all at once for reduced-motion
  const allLines = useMemo(() => {
    const lines: Array<{ type: "command" | "output"; text: string }> = [];
    for (const step of steps) {
      lines.push({ type: "command", text: step.command });
      for (const out of step.output) {
        lines.push({ type: "output", text: out });
      }
    }
    return lines;
  }, [steps]);

  // Clear any pending timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Core animation loop
  useEffect(() => {
    if (prefersReduced.current) {
      setState({
        stepIndex: steps.length,
        charsTyped: 0,
        outputVisible: false,
        history: allLines,
        phase: "done",
      });
      return;
    }

    if (!isPlaying || state.phase === "done") return;

    const currentStep = steps[state.stepIndex];
    if (!currentStep) return;

    if (state.phase === "typing") {
      if (state.charsTyped < currentStep.command.length) {
        timerRef.current = setTimeout(() => {
          setState((s) => ({ ...s, charsTyped: s.charsTyped + 1 }));
        }, randomTypingDelay());
      } else {
        // Finished typing command, pause then show output
        timerRef.current = setTimeout(() => {
          setState((s) => ({ ...s, outputVisible: true, phase: "showing-output" }));
        }, PAUSE_AFTER_TYPING);
      }
    } else if (state.phase === "showing-output") {
      // Output shown, pause then move to next step
      const pauseDuration =
        state.stepIndex === steps.length - 1
          ? PAUSE_BEFORE_RESTART
          : PAUSE_AFTER_OUTPUT;

      timerRef.current = setTimeout(() => {
        setState((s) => {
          const newHistory = [
            ...s.history,
            { type: "command" as const, text: currentStep.command },
            ...currentStep.output.map((o) => ({
              type: "output" as const,
              text: o,
            })),
          ];

          const nextIndex = s.stepIndex + 1;
          if (nextIndex >= steps.length) {
            // Loop: restart animation
            return {
              stepIndex: 0,
              charsTyped: 0,
              outputVisible: false,
              history: [],
              phase: "typing" as AnimPhase,
            };
          }

          return {
            ...s,
            stepIndex: nextIndex,
            charsTyped: 0,
            outputVisible: false,
            history: newHistory,
            phase: "typing" as AnimPhase,
          };
        });
      }, pauseDuration);
    }

    return clearTimer;
  }, [state, isPlaying, steps, allLines, clearTimer]);

  const restart = useCallback(() => {
    clearTimer();
    setState({
      stepIndex: 0,
      charsTyped: 0,
      outputVisible: false,
      history: [],
      phase: "typing",
    });
    setIsPlaying(true);
  }, [clearTimer]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const currentStep = steps[state.stepIndex] as CommandStep | undefined;
  const typedText = currentStep
    ? currentStep.command.slice(0, state.charsTyped)
    : "";

  return {
    history: state.history,
    typedText,
    currentOutput: state.outputVisible && currentStep ? currentStep.output : [],
    isTyping: state.phase === "typing" && state.charsTyped < (currentStep?.command.length ?? 0),
    isPlaying,
    isDone: state.phase === "done",
    restart,
    togglePlay,
  };
}

/* ─── Subcomponents ─── */

function StoplightDots() {
  return (
    <div className="flex items-center gap-2 select-none" aria-hidden="true">
      <div className="w-3 h-3 rounded-full bg-[rgb(255,95,86)]" />
      <div className="w-3 h-3 rounded-full bg-[rgb(255,189,46)]" />
      <div className="w-3 h-3 rounded-full bg-[rgb(39,201,63)]" />
    </div>
  );
}

function Cursor() {
  return (
    <span
      className="inline-block w-[2px] h-[1.1em] bg-[#EDF2EF] align-middle ml-0.5"
      style={{ animation: "blink 1s step-end infinite" }}
      aria-hidden="true"
    />
  );
}

function CommandLine({
  text,
  showCursor,
  onCopy,
  isCopied,
}: {
  text: string;
  showCursor?: boolean;
  onCopy?: () => void;
  isCopied?: boolean;
}) {
  // Colorize: "pkgx" in blue, flags/versions in teal
  const parts = colorizeCommand(text);

  return (
    <div className="group/line flex items-center gap-2 min-h-[1.5em] relative">
      <span className="text-[rgba(237,242,239,0.4)] select-none shrink-0" aria-hidden="true">
        $
      </span>
      <span className="text-[#EDF2EF] flex-1">
        {parts}
        {showCursor && <Cursor />}
      </span>
      {onCopy && text.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          className={cn(
            "shrink-0 p-1 rounded transition-all duration-200",
            "opacity-0 group-hover/line:opacity-100 focus-visible:opacity-100",
            "hover:bg-white/10 text-[rgba(237,242,239,0.5)] hover:text-[#EDF2EF]"
          )}
          aria-label={isCopied ? "Copied!" : `Copy command: ${text}`}
          title={isCopied ? "Copied!" : "Copy"}
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-[#74FAD1]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

function OutputLine({ text }: { text: string }) {
  const isSuccess = text.startsWith("✓");
  return (
    <div
      className={cn(
        "pl-5 animate-fade-in",
        isSuccess ? "text-[#74FAD1]" : "text-[rgba(237,242,239,0.7)]"
      )}
    >
      {text}
    </div>
  );
}

/** Tokenize command for syntax highlighting */
function colorizeCommand(text: string): React.ReactNode[] {
  if (!text) return [];

  const tokens = text.split(/(\s+)/);
  const nodes: React.ReactNode[] = [];
  let seenCommand = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (/^\s+$/.test(token)) {
      nodes.push(token);
      continue;
    }

    if (!seenCommand && token === "pkgx") {
      nodes.push(
        <span key={i} className="text-[#4156E1] font-semibold">
          {token}
        </span>
      );
      seenCommand = true;
    } else if (/@\S+/.test(token)) {
      // Version specifier (e.g. python@3.12)
      const atIdx = token.indexOf("@");
      nodes.push(
        <span key={i}>
          <span className="text-[#EDF2EF]">{token.slice(0, atIdx)}</span>
          <span className="text-[#74FAD1]">{token.slice(atIdx)}</span>
        </span>
      );
    } else if (token.startsWith("--")) {
      nodes.push(
        <span key={i} className="text-[rgba(237,242,239,0.5)]">
          {token}
        </span>
      );
    } else {
      nodes.push(<span key={i}>{token}</span>);
    }
  }

  return nodes;
}

/* ─── Main Component ─── */

export default function TerminalDemo() {
  const isxs = useIsMobile();
  const { copied, copy } = useClipboard();
  const {
    history,
    typedText,
    currentOutput,
    isTyping,
    isPlaying,
    isDone,
    restart,
    togglePlay,
  } = useTerminalAnimation(DEMO_SEQUENCE);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as lines appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, typedText, currentOutput]);

  const handleCopyCommand = useCallback(
    (cmd: string) => {
      copy(cmd);
    },
    [copy]
  );

  // Collect all commands for "copy all" functionality
  const allCommands = DEMO_SEQUENCE.map((s) => s.command).join("\n");

  return (
    <div
      className={cn(
        "rounded-xl border border-[rgba(149,178,184,0.15)] bg-[#070C14] overflow-hidden",
        "shadow-[0_0_80px_5px_rgba(65,86,225,0.06)]"
      )}
      role="region"
      aria-label="Interactive terminal demo showing pkgx commands"
    >
      {/* Title bar */}
      <div
        className={cn(
          "flex items-center justify-between border-b border-[rgba(149,178,184,0.1)]",
          isxs ? "px-3 py-2.5" : "px-4 py-3"
        )}
      >
        <StoplightDots />

        <span className="text-[10px] text-[rgba(237,242,239,0.3)] tracking-wider uppercase select-none">
          Terminal
        </span>

        {/* Controls */}
        <div className="flex items-center gap-1" role="toolbar" aria-label="Terminal controls">
          <button
            onClick={togglePlay}
            className={cn(
              "p-1.5 rounded-md transition-all duration-200",
              "text-[rgba(237,242,239,0.4)] hover:text-[#EDF2EF] hover:bg-white/[0.06]",
              "focus-visible:ring-2 focus-visible:ring-[#4156E1]"
            )}
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={restart}
            className={cn(
              "p-1.5 rounded-md transition-all duration-200",
              "text-[rgba(237,242,239,0.4)] hover:text-[#EDF2EF] hover:bg-white/[0.06]",
              "focus-visible:ring-2 focus-visible:ring-[#4156E1]"
            )}
            aria-label="Restart animation"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className={cn(
          "font-mono overflow-y-auto overflow-x-auto",
          isxs ? "p-3 text-xs max-h-[240px]" : "p-5 text-sm max-h-[320px]"
        )}
      >
        <div className="space-y-1" aria-live="polite" aria-atomic="false">
          {/* History: completed steps */}
          {history.map((line, i) =>
            line.type === "command" ? (
              <CommandLine
                key={`h-${i}`}
                text={line.text}
                onCopy={() => handleCopyCommand(line.text)}
                isCopied={copied}
              />
            ) : (
              <OutputLine key={`h-${i}`} text={line.text} />
            )
          )}

          {/* Currently typing command */}
          {!isDone && (
            <>
              <CommandLine
                text={typedText}
                showCursor={isTyping || !isPlaying}
                onCopy={
                  typedText.length > 0
                    ? () => handleCopyCommand(DEMO_SEQUENCE[0]?.command ?? typedText)
                    : undefined
                }
                isCopied={copied}
              />

              {/* Current step output */}
              {currentOutput.map((line, i) => (
                <OutputLine key={`o-${i}`} text={line} />
              ))}
            </>
          )}
        </div>

        {/* Reduced-motion: show all at once */}
        {isDone && history.length === 0 && (
          <div className="space-y-1">
            {DEMO_SEQUENCE.map((step, si) => (
              <div key={si}>
                <CommandLine
                  text={step.command}
                  onCopy={() => handleCopyCommand(step.command)}
                  isCopied={copied}
                />
                {step.output.map((out, oi) => (
                  <OutputLine key={`${si}-${oi}`} text={out} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer: copy-all hint */}
      <div className="border-t border-[rgba(149,178,184,0.08)] px-4 py-2 flex justify-end">
        <button
          onClick={() => copy(allCommands)}
          className={cn(
            "inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider",
            "text-[rgba(237,242,239,0.3)] hover:text-[rgba(237,242,239,0.6)] transition-colors",
            "focus-visible:ring-2 focus-visible:ring-[#4156E1] rounded px-2 py-1"
          )}
          aria-label="Copy all commands"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#74FAD1]" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy all
            </>
          )}
        </button>
      </div>
    </div>
  );
}
