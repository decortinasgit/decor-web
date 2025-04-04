"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { getColumns } from "./curtains-table-columns";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { OrderItem } from "@/db/schema";
import { Curtain } from "@/types/curtains";

interface CurtainsTableProps {
  data: Curtain[] | OrderItem[];
  pageCount: number;
  duplicateRow: (index: number) => void;
  deleteRow: (index: number) => void;
  hideActions?: boolean;
  pdfTable?: boolean;
}

export function CurtainsTable({
  data,
  pageCount,
  hideActions,
  duplicateRow,
  deleteRow,
  pdfTable,
}: CurtainsTableProps) {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(
    () =>
      getColumns({
        hideActions,
        duplicateRow: (index: number) => duplicateRow(index), // Asegura que duplicateRow pase el index
        deleteRow: (index: number) => deleteRow(index),
      }),
    [hideActions, duplicateRow, deleteRow]
  );

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "qty", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.name}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table} pdfTable={pdfTable}>
      <DataTableToolbar table={table} pdfTable={pdfTable} />
    </DataTable>
  );
}
