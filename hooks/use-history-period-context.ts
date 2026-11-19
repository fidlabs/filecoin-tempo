import {
  HistoryPeriodContext,
  HistoryPeriodContextShape,
} from "@/components/history-period-context";
import { useContext } from "react";

export function useHistoryPeriodContext(): HistoryPeriodContextShape {
  const context = useContext(HistoryPeriodContext);

  if (context === undefined) {
    throw new TypeError(
      "useHistoryPeriodContext must be used within HistoryPeriodContextProvider"
    );
  }

  return context;
}
