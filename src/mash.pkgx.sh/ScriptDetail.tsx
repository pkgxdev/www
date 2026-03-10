import { ArrowUpRight } from "lucide-react";
import Terminal from "../components/Terminal";
import Markdown from "../components/Markdown";
import { useAsync } from "react-use";

export interface Script {
  fullname: string;
  birthtime: string;
  description?: string;
  avatar: string;
  url: string;
  README?: string;
  cmd: string;
}

export default function ScriptComponent({
  fullname,
  birthtime,
  cmd,
  README: description,
  avatar,
  url,
}: Script) {
  const {
    loading,
    error,
    value: content,
  } = useAsync(async () => {
    const rsp = await fetch(`https://pkgxdev.github.io/mash/u/${fullname}`);
    return await rsp.text();
  });

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
      </div>
      {description ? <Markdown txt={description} /> : <Terminal>{cmd}</Terminal>}
      {excerpt()}
      <div className="flex gap-3 mt-4">
        <a
          href={url}
          target="github"
          className="inline-flex items-center gap-1 bg-[#4156E1] text-white px-4 py-2 rounded font-medium hover:bg-[#3348c4] transition-colors no-underline"
        >
          GitHub <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );

  function excerpt() {
    if (loading) {
      return <div className="h-6 bg-white/5 rounded animate-pulse" />;
    } else if (error) {
      return (
        <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">
          {error.message}
        </div>
      );
    } else {
      return <Terminal>{content}</Terminal>;
    }
  }
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
  else if (diffInSeconds < hour)
    return rtf.format(-Math.round(diffInSeconds / minute), "minute");
  else if (diffInSeconds < day)
    return rtf.format(-Math.round(diffInSeconds / hour), "hour");
  else if (diffInSeconds < week)
    return rtf.format(-Math.round(diffInSeconds / day), "day");
  else return rtf.format(-Math.round(diffInSeconds / week), "week");
}
