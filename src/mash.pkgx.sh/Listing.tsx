import { ScriptComponent, Script } from "./Script";
import { useAsync } from "react-use";

export default function Landing() {
  const data = useAsync(async () => {
    const rsp = await fetch("https://pkgxdev.github.io/mash/index.json");
    const data = await rsp.json();
    return (data.scripts as Script[]).filter(({ description }) => description);
  });

  return (
    <div className="space-y-4">
      {body()}
    </div>
  );

  function body() {
    if (data.loading) {
      return (
        <>
          <div className="h-6 bg-white/5 rounded animate-pulse" />
          <div className="h-6 bg-white/5 rounded animate-pulse" />
          <div className="h-6 bg-white/5 rounded animate-pulse" />
        </>
      );
    } else if (data.error) {
      return (
        <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">
          {data.error.message}
        </div>
      );
    } else {
      return data.value!.map((script) => (
        <ScriptComponent key={script.fullname} {...script} />
      ));
    }
  }
}
