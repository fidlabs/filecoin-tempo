"use client";

import { HTMLAttributes, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = Omit<HTMLAttributes<HTMLDivElement>, "children">;

export function NotImplementedOverlay({ className, ...rest }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div
      {...rest}
      className={cn(
        "absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center gap-y-4 p-4 backdrop-blur-sm",
        className
      )}
    >
      <p className="text-center text-sm">
        Not yet implemented.
        <br />
        Showing example values.
      </p>
      <Button size="sm" variant="outline" onClick={() => setDismissed(true)}>
        Dismiss
      </Button>
    </div>
  );
}
