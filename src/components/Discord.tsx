import discord from "../assets/wordmarks/discord.svg";

export default function Discord() {
  return (
    <a
      href="https://discord.gg/rNwNUY83XS"
      className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
      aria-label="Join Discord"
    >
      <img src={discord} alt="Discord" className="h-5 w-5" />
    </a>
  );
}
