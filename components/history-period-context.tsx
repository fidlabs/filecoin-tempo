"use client";

import { parseAsStringEnum, useQueryState } from "nuqs";
import { createContext, PropsWithChildren } from "react";

export type HistoryPeriod = (typeof availableHistoryPeriods)[number];

export type HistoryPeriodContextShape = {
  availableHistoryPeriods: readonly HistoryPeriod[];
  historyPeriod: HistoryPeriod;
  setHistoryPeriod(historyPeriod: HistoryPeriod): void;
};

export const availableHistoryPeriods = ["30d", "90d", "1y", "all"] as const;

export const HistoryPeriodContext = createContext<HistoryPeriodContextShape>({
  availableHistoryPeriods,
  historyPeriod: "30d",
  setHistoryPeriod() {},
});

export function historyPeriodLabel(historyPeriod: HistoryPeriod): string {
  switch (historyPeriod) {
    case "30d":
      return "30 days";
    case "90d":
      return "90 days";
    case "1y":
      return "1 year";
    case "all":
      return "All";
  }
}

export function HistoryPeriodContextProvider({ children }: PropsWithChildren) {
  const [historyPeriod, setHistoryPeriod] = useQueryState(
    "period",
    parseAsStringEnum([...availableHistoryPeriods]).withDefault("30d")
  );

  return (
    <HistoryPeriodContext.Provider
      value={{
        availableHistoryPeriods,
        historyPeriod,
        setHistoryPeriod,
      }}
    >
      {children}
    </HistoryPeriodContext.Provider>
  );
}
