"use client";

import { useHistoryPeriodContext } from "@/hooks/use-history-period-context";
import { historyPeriodLabel } from "./history-period-context";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function HistoryPeriodTabs() {
  const { historyPeriod, availableHistoryPeriods, setHistoryPeriod } =
    useHistoryPeriodContext();

  return (
    <Tabs value={historyPeriod} onValueChange={setHistoryPeriod}>
      <TabsList>
        {availableHistoryPeriods.map((period) => (
          <TabsTrigger key={period} value={period}>
            {historyPeriodLabel(period)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
