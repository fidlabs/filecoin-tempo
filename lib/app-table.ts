import { AppTableColumnSelect } from "@/components/app-table-column-select";
import { AppTableContent } from "@/components/app-table-content";
import { AppTablePageSizeSelect } from "@/components/app-table-page-size-select";
import { AppTableRowCount } from "@/components/app-table-row-count";
import { AppTableSimplePagination } from "@/components/app-table-simple-pagination";
import {
  columnSizingFeature,
  columnVisibilityFeature,
  createTableHook,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";

const features = tableFeatures({
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
});

export const {
  createAppColumnHelper,
  useAppTable,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  features,
  manualPagination: true,
  manualSorting: true,
  tableComponents: {
    ColumnSelect: AppTableColumnSelect,
    Content: AppTableContent,
    PageSizeSelect: AppTablePageSizeSelect,
    RowCount: AppTableRowCount,
    SimplePagination: AppTableSimplePagination,
  },
});
