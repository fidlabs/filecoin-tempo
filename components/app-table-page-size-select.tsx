import { useTableContext } from "@/lib/app-table";
import { uniq } from "es-toolkit";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type AppTablePageSizeSelectProps = {
  options: [number, ...number[]];
};

export function AppTablePageSizeSelect({
  options,
}: AppTablePageSizeSelectProps) {
  const table = useTableContext();
  const { pageSize } = table.state.pagination;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        {pageSize} rows per page
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {uniq(options)
          .toSorted((a, b) => a - b)
          .map((option) => {
            return (
              <DropdownMenuCheckboxItem
                key={option}
                checked={pageSize === option}
                onCheckedChange={() => {
                  table.setPageSize(option);
                }}
              >
                <span>{option}</span>
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
