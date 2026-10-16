import { useTableContext } from "@/lib/app-table";
import { type PropsWithChildren } from "react";
import { Skeleton } from "./ui/skeleton";

function Text({ children }: PropsWithChildren) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function AppTableRowCount() {
  const table = useTableContext();

  if (!table.state.pagination) {
    return (
      <Text>
        <Skeleton className="h-lh w-20" />
      </Text>
    );
  }

  const totalCount = table.getRowCount();

  if (totalCount === 0) {
    return <Text>0 rows</Text>;
  }

  const { pageIndex, pageSize } = table.state.pagination;
  const rangeStart = pageIndex * pageSize + 1;
  const rangeEnd = Math.min(rangeStart + pageSize - 1, totalCount);

  return (
    <Text>
      Rows {rangeStart}-{rangeEnd} of {totalCount}
    </Text>
  );
}
