import { cn } from "../utils/cn";

export default function HeroTypography({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-gradient text-center font-light uppercase text-[48px] md:text-[88px]",
        "leading-[0.95] tracking-tight",
        className
      )}
      style={{ fontFamily: "shader, Roboto, sans-serif" }}
      {...props}
    >
      {children}
    </h1>
  );
}
