import { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export type ChartCardProps = ComponentProps<typeof Card>;

export function ChartCard({ children, className, ...rest }: ChartCardProps) {
  return (
    <Card {...rest} className={cn("pt-0 pb-2", className)}>
      {children}
    </Card>
  );
}

export type ChartCardHeaderProps = ComponentProps<typeof CardHeader>;

export function ChartCardHeader({
  children,
  className,
  ...rest
}: ChartCardHeaderProps) {
  return (
    <CardHeader
      {...rest}
      className={cn(
        "flex flex-col items-stretch border-b p-0! sm:flex-row",
        className
      )}
    >
      {children}
    </CardHeader>
  );
}

export type ChardCardHeaderTextProps = HTMLAttributes<HTMLDivElement>;

export function ChartCardHeaderText({
  children,
  className,
  ...rest
}: ChardCardHeaderTextProps) {
  return (
    <div
      {...rest}
      className={cn(
        "flex flex-1 flex-col justify-center gap-1 p-[var(--card-spacing)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export type ChartCardHeaderExtraProps = HTMLAttributes<HTMLDivElement>;

export function ChartCardHeaderExtra({
  children,
  className,
  ...rest
}: ChartCardHeaderExtraProps) {
  return (
    <div
      {...rest}
      className={cn(
        "flex flex-col justify-center gap-1 border-t px-6 py-4 sm:border-t-0 sm:border-l",
        className
      )}
    >
      {children}
    </div>
  );
}

export type ChartCardHeaderExtraValueProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  error?: boolean;
  value: ReactNode;
};

export function ChartCardHeaderExtraValue({
  className,
  error = false,
  value,
  ...rest
}: ChartCardHeaderExtraValueProps) {
  return (
    <span
      {...rest}
      className={cn("text-lg leading-none font-bold sm:text-3xl", className)}
    >
      {!error && value !== null && value}
      {!error && value === null && (
        <Skeleton as="span" className="inline-block h-lh w-[64px]" />
      )}
      {error && <span className="text-lg text-destructive">Error</span>}
    </span>
  );
}

export type ChartCardHeaderExtraLabelProps = HTMLAttributes<HTMLSpanElement>;

export function ChartCardHeaderExtraLabel({
  children,
  className,
  ...rest
}: ChartCardHeaderExtraLabelProps) {
  return (
    <span {...rest} className={cn("text-xs text-muted-foreground", className)}>
      {children}
    </span>
  );
}

export type ChartCardContentProps = ComponentProps<typeof CardContent>;

export function ChartCardContent({
  children,
  className,
  ...rest
}: ChartCardContentProps) {
  return (
    <CardContent {...rest} className={cn("px-1.5", className)}>
      {children}
    </CardContent>
  );
}
