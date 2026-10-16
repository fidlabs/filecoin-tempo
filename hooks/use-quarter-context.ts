import {
  QuarterContext,
  QuarterContextShape,
} from "@/components/quarter-context";
import { useContext } from "react";

export function useQuarterContext(): QuarterContextShape {
  const context = useContext(QuarterContext);

  if (context === undefined) {
    throw new TypeError(
      "useQuarterContext must be used within QuarterContextProvider"
    );
  }

  return context;
}
