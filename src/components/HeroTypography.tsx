import { cn } from "../utils/cn";

export default function HeroTypography({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-gradient text-center font-light uppercase text-[40px] md:text-[80px]",
        "font-[shader,Roboto,sans-serif]",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
