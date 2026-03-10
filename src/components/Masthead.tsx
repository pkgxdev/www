import { useIsMobile } from "../utils/useIsMobile";
import logo from "../assets/wordmarks/pkgx.svg";

export default function Masthead({
  children,
  left,
}: {
  children?: React.ReactNode;
  left?: React.ReactNode;
}) {
  const isxs = useIsMobile();

  return (
    <div className="flex items-center gap-2">
      <a href="https://pkgx.dev">
        <img
          src={logo}
          alt="pkgx"
          className={`block ${isxs ? "h-5" : "h-7"}`}
        />
      </a>
      {left}
      <div className="flex-grow" />
      {children}
    </div>
  );
}
