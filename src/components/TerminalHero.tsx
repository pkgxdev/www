import { useEffect, useRef, useState } from "react";

const COMMANDS = [
  { cmd: "pkgx run node app.js", output: "Server running on :3000 ✓" },
  { cmd: "pkgx python3 train.py", output: "Epoch 10/10 — accuracy: 0.97 ✓" },
  { cmd: "pkgx rustc hello.rs", output: "Compiling hello v0.1.0 ✓" },
  { cmd: "pkgx deno run server.ts", output: "Listening on https://localhost:8000 ✓" },
  { cmd: "pkgx go run main.go", output: "Hello, World! ✓" },
];

const TYPING_SPEED = 45;
const PAUSE_AFTER_CMD = 600;
const PAUSE_AFTER_OUTPUT = 1800;

export default function TerminalHero() {
  const [cmdIdx, setCmdIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "output" | "clearing">("typing");
  const [displayed, setDisplayed] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const prefersReduced = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }, []);

  useEffect(() => {
    if (prefersReduced.current) {
      setDisplayed(COMMANDS[0].cmd);
      setShowOutput(true);
      return;
    }

    const current = COMMANDS[cmdIdx];

    if (phase === "typing") {
      if (displayed.length < current.cmd.length) {
        const t = setTimeout(() => {
          setDisplayed(current.cmd.slice(0, displayed.length + 1));
        }, TYPING_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setShowOutput(true);
          setPhase("output");
        }, PAUSE_AFTER_CMD);
        return () => clearTimeout(t);
      }
    }

    if (phase === "output") {
      const t = setTimeout(() => {
        setShowOutput(false);
        setPhase("clearing");
        setDisplayed("");
      }, PAUSE_AFTER_OUTPUT);
      return () => clearTimeout(t);
    }

    if (phase === "clearing") {
      const t = setTimeout(() => {
        setCmdIdx((i) => (i + 1) % COMMANDS.length);
        setPhase("typing");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [phase, displayed, cmdIdx]);

  const current = COMMANDS[cmdIdx];

  return (
    <div
      data-terminal
      className="rounded-xl p-6 pt-10 font-mono text-sm md:text-base overflow-hidden relative halo"
      role="img"
      aria-label="Terminal showing pkgx running various programming tools instantly"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[#EDF2EF] min-h-[1.5em]">
          <span className="text-[#74FAD1] select-none" aria-hidden="true">$</span>
          <span className="text-[#EDF2EF]">{displayed}</span>
          {phase === "typing" && (
            <span
              className="inline-block w-0.5 h-4 bg-[#EDF2EF] animate-pulse"
              aria-hidden="true"
            />
          )}
        </div>
        {showOutput && (
          <div className="text-[#74FAD1] pl-4 animate-fade-in">
            {current.output}
          </div>
        )}
      </div>
    </div>
  );
}
