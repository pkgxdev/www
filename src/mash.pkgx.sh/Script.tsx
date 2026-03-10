import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import Markdown from "../components/Markdown";
import Terminal from "../components/Terminal";
import ScriptDetail from "./ScriptDetail";
import { useAsync } from "react-use";

export interface Script {
  fullname: string;
  birthtime: string;
  description?: string;
  avatar: string;
  url: string;
  cmd: string;
  README?: string;
  category?: string;
}

export default function ScriptRoute() {
  const path = useLocation().pathname;

  const data = useAsync(async () => {
    const rsp = await fetch("https://pkgxdev.github.io/mash/index.json");
    const data = await rsp.json();
    return data.scripts.find((s: any) => `/${s.fullname}` === path) as Script;
  });

  if (data.loading) {
    return <div className="h-6 bg-white/5 rounded animate-pulse" />;
  } else if (data.error || !data.value) {
    return (
      <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">
        {data.error?.message ?? "Script not found"}
      </div>
    );
  } else {
    return <ScriptDetail {...data.value} />;
  }
}

export function ScriptComponent({
  fullname,
  birthtime,
  description,
  avatar,
  url,
  cmd,
  category,
}: Script) {
  const username = fullname.split("/")[0];

  return (
    <div className="rounded-lg border border-[rgba(149,178,184,0.3)] bg-[#0D1117] p-4">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={username}
          title={username}
          className="w-6 h-6 rounded-full"
        />
        <span>{fullname}</span>
        <span className="text-xs text-[rgba(237,242,239,0.5)]">{timeAgo(birthtime)}</span>
        {category && (
          <span
            className="bg-[#F26212] text-[#0D1117] text-xs px-2 py-0.5 rounded-full font-medium uppercase"
          >
            {category}
          </span>
        )}
      </div>
      {description && <Markdown txt={description} />}
      <Terminal>{cmd}</Terminal>
      <div className="flex gap-3">
        <a
          href={`/${fullname}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-[rgba(149,178,184,0.3)] rounded text-sm hover:bg-white/5 transition-colors no-underline"
        >
          Usage <ArrowRight className="w-3 h-3" />
        </a>
        <a
          href={url}
          target="github"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm hover:bg-white/5 rounded transition-colors no-underline"
        >
          GitHub <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function timeAgo(date: Date | string) {
  const now = new Date().getTime();
  const diffInSeconds = Math.round((now - new Date(date).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: "auto" });

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  if (diffInSeconds < minute) return rtf.format(-diffInSeconds, "second");
  else if (diffInSeconds < hour) return rtf.format(-Math.round(diffInSeconds / minute), "minute");
  else if (diffInSeconds < day) return rtf.format(-Math.round(diffInSeconds / hour), "hour");
  else if (diffInSeconds < week) return rtf.format(-Math.round(diffInSeconds / day), "day");
  else return rtf.format(-Math.round(diffInSeconds / week), "week");
}
