import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export type Props = Omit<HTMLAttributes<HTMLParagraphElement>, "children">;

export function PeriodChartResolutionInfo({ className, ...rest }: Props) {
  return (
    <p {...rest} className={cn("text-sm text-muted-foreground", className)}>
      Bars are daily up to 90 days, weekly up to 1 year and monthly beyond.
    </p>
  );
}
