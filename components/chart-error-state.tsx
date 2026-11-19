import { RefreshCcwIcon, ServerCrashIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "./ui/empty";
import { Button } from "./ui/button";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ChartErrorStateProps = Omit<
  ComponentProps<typeof Empty>,
  "children"
> & {
  onRefresh?(): unknown;
};

export function ChartErrorState({
  className,
  onRefresh,
  ...rest
}: ChartErrorStateProps) {
  return (
    <Empty {...rest} className={cn("h-full", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ServerCrashIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyDescription>
          An error has occured when loading data. Please try again later.
        </EmptyDescription>
      </EmptyHeader>
      {!!onRefresh && (
        <EmptyContent>
          <Button variant="outline" onClick={() => onRefresh()}>
            <RefreshCcwIcon />
            Refresh
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
