import { cn } from "cn";
import type { ElementType } from "react";
import { Box, type BoxProps } from "./box";

function Skeleton<T extends ElementType = "div">(props: BoxProps<T>) {
  return (
    <Box<T>
      {...props}
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", props.className)}
    />
  );
}

export { Skeleton };
