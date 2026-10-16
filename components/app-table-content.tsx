import { useTableContext } from "@/lib/app-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useDelayedFlag } from "@/hooks/use-delayed-flag";
import { range } from "es-toolkit";
import { Skeleton } from "./ui/skeleton";
import { CSSProperties, ReactNode } from "react";

export type AppTableContentProps = {
  emptyState?: (() => ReactNode) | ReactNode;
  error?: unknown;
  errorState?: (() => ReactNode) | ReactNode;
  loading?: boolean;
  loadingSekeletonSizes?: Record<
    string,
    CSSProperties["width"] | [CSSProperties["width"], CSSProperties["height"]]
  >;
  loadingDelayMs?: number;
  loadingRowHeight?: number;
};

export function AppTableContent({
  emptyState,
  error,
  errorState,
  loading = false,
  loadingSekeletonSizes,
  loadingDelayMs = 100,
  loadingRowHeight,
}: AppTableContentProps) {
  const table = useTableContext();
  const isLongLoading = useDelayedFlag(loading, loadingDelayMs);
  const showLoading =
    isLongLoading || (loading && table.getRowModel().rows.length === 0);
  const maxColspan = Math.max(
    ...table.getHeaderGroups().map((headerGroup) => headerGroup.headers.length)
  );

  const showErrorState = !showLoading && !!error;
  const showEmptyState =
    !showLoading && !showErrorState && table.getRowModel().rows.length === 0;

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <table.AppHeader header={header} key={header.id}>
                    {(appHeader) => (
                      <TableHead>
                        {header.isPlaceholder ? null : <appHeader.FlexRender />}
                      </TableHead>
                    )}
                  </table.AppHeader>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {showLoading &&
            range(table.state.pagination.pageSize).map((skeletonRowIndex) => {
              const cells = table.getVisibleFlatColumns().map((column) => {
                const configuredSkeletonSize =
                  loadingSekeletonSizes?.[column.id];
                const configuredSkeletonSizeArray = Array.isArray(
                  configuredSkeletonSize
                )
                  ? configuredSkeletonSize
                  : [configuredSkeletonSize, undefined];
                const [width = 50, height = "1lh"] =
                  configuredSkeletonSizeArray ?? [undefined, undefined];

                return (
                  <TableCell key={column.id}>
                    <div
                      className="inline-flex items-center"
                      style={{ height: loadingRowHeight }}
                    >
                      <Skeleton style={{ width, height }} />
                    </div>
                  </TableCell>
                );
              });

              return <TableRow key={skeletonRowIndex}>{cells}</TableRow>;
            })}

          {showErrorState && (
            <TableRow>
              <TableCell colSpan={maxColspan}>
                {typeof errorState === "function" ? (
                  errorState()
                ) : errorState !== undefined ? (
                  errorState
                ) : (
                  <div className="flex h-24 items-center justify-center">
                    <p className="text-desctructive text-center">
                      Error has occured.
                    </p>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}

          {!showLoading &&
            !showErrorState &&
            table.getRowModel().rows.length > 0 &&
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <table.AppCell cell={cell} key={cell.id}>
                    {(appCell) => {
                      return (
                        <TableCell>
                          <appCell.FlexRender />
                        </TableCell>
                      );
                    }}
                  </table.AppCell>
                ))}
              </TableRow>
            ))}

          {showEmptyState && (
            <TableRow>
              <TableCell colSpan={maxColspan}>
                {typeof emptyState === "function" ? (
                  emptyState()
                ) : emptyState !== undefined ? (
                  emptyState
                ) : (
                  <div className="flex h-24 items-center justify-center">
                    <p className="text-center">No results.</p>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
