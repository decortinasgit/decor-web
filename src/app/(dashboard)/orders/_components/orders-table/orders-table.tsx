"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { getColumns } from "./orders-table-columns";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { OrderWithItems } from "@/types/orders";
import { useOrderStore } from "@/lib/store";

interface OrdersTableProps {
  data: OrderWithItems[];
  pageCount: number;
  hideActions?: boolean;
}

export function OrdersTable({
  data,
  pageCount,
  hideActions,
}: OrdersTableProps) {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns({ hideActions }), []);

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
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
