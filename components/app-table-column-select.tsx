import { useTableContext } from "@/lib/app-table";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function AppTableColumnSelect() {
  const table = useTableContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {table.getVisibleFlatColumns().length} of{" "}
        {table.getAllFlatColumns().length} columns visible
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {table.getAllColumns().map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              disabled={!column.getCanHide()}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => {
                const lastVisibleColumn =
                  table.getVisibleFlatColumns().length === 1;
                if (!value && lastVisibleColumn) return;
                column.toggleVisibility(value);
              }}
            >
              <span>{column.id}</span>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
