import { useIsMobile } from "../utils/useIsMobile";
import { cn } from "../utils/cn";

export default function Terminal({
  children,
  width,
  mb,
  mt,
}: {
  children: React.ReactNode;
  width?: string;
  mb?: number;
  mt?: number;
}) {
  const isxs = useIsMobile();
  const hasStoplights = width === undefined;

  return (
    <div
      className={cn(
        "font-mono whitespace-pre overflow-x-auto block mx-auto overflow-visible",
        isxs ? "text-sm" : ""
      )}
      style={{
        width: width ?? "100%",
        marginBottom: mb !== undefined ? `${mb * 8}px` : "32px",
        marginTop: mt !== undefined ? `${mt * 8}px` : "32px",
      }}
    >
      <div
        className={cn(
          "rounded-lg border border-[rgba(149,178,184,0.3)]",
          isxs ? "p-2" : "p-4",
          hasStoplights && "pt-6"
        )}
        data-terminal={hasStoplights || undefined}
      >
        {children}
      </div>
    </div>
  );
}

export function Dim({ children }: { children: React.ReactNode }) {
  return <span className="opacity-60">{children}</span>;
}

export function Purple({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[#4156E1] font-[inherit]">{children}</span>
  );
}

export function Orange({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[#F26212] font-[inherit]">{children}</span>
  );
}

export function Prompt() {
  return <Dim>$</Dim>;
}
