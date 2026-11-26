import { cn } from "@/lib/utils";
import { range } from "es-toolkit";
import { HTMLAttributes } from "react";
import { Skeleton } from "./ui/skeleton";

export type BarChartSkeletonProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  barsCount?: number;
};

const heights = [45, 70, 35, 85, 55, 95, 60];

export function BarChartSkeleton({
  barsCount = 12,
  className,
  ...rest
}: BarChartSkeletonProps) {
  return (
    <div
      {...rest}
      className={cn(
        "flex h-full w-full items-end gap-2 px-3 pt-4 pb-8",
        className
      )}
    >
      {range(barsCount).map((index) => (
        <Skeleton
          key={index}
          className="flex-1"
          style={{
            height: heights[index % heights.length] + "%",
          }}
        />
      ))}
    </div>
  );
}
