"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ColumnId, useOrderStore } from "@/lib/store";
import { hasDraggableData } from "@/lib/utils";
import {
  Announcements,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import type { Column } from "./board-column";
import { BoardColumn, BoardContainer } from "./board-column";
import { OrderStatus } from "@/db/schema";
import { OrderWithItems } from "@/types/orders";
import { OrderCard } from "./order-card";

export function KanbanBoard() {
  // const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columns = useOrderStore((state) => state.columns);
  const pickedUpOrderColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // const [orders, setOrders] = useState<Order[]>(initialOrders);
  const orders = useOrderStore((state) => state.orders);
  const setOrders = useOrderStore((state) => state.setOrders);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [isMounted, setIsMounted] = useState<Boolean>(false);

  const [activeOrder, setActiveOrder] = useState<OrderWithItems | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: coordinateGetter,
    // }),
  );

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    useOrderStore.persist.rehydrate();
  }, []);
  if (!isMounted) return;

  function getDraggingOrderData(orderId: UniqueIdentifier, columnId: ColumnId) {
    const ordersInColumn = orders.filter((order) => order.status === columnId);
    const orderPosition = ordersInColumn.findIndex(
      (order) => order.id === orderId
    );
    const column = columns.find((col) => col.id === columnId);
    return {
      ordersInColumn,
      orderPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "OrderWithItems") {
        pickedUpOrderColumn.current = active.data.current.order.status;
        const { ordersInColumn, orderPosition, column } = getDraggingOrderData(
          active.id,
          pickedUpOrderColumn.current
        );
        return `Picked up Order ${active.data.current.order.id} at position: ${
          orderPosition + 1
        } of ${ordersInColumn.length} in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "OrderWithItems" &&
        over.data.current?.type === "OrderWithItems"
      ) {
        const { ordersInColumn, orderPosition, column } = getDraggingOrderData(
          over.id,
          over.data.current.order.status
        );
        if (over.data.current.order.status !== pickedUpOrderColumn.current) {
          return `Order ${active.data.current.order.id} was moved over column ${
            column?.title
          } in position ${orderPosition + 1} of ${ordersInColumn.length}`;
        }
        return `Order was moved over position ${orderPosition + 1} of ${
          ordersInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpOrderColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "OrderWithItems" &&
        over.data.current?.type === "OrderWithItems"
      ) {
        const { ordersInColumn, orderPosition, column } = getDraggingOrderData(
          over.id,
          over.data.current.order.status
        );
        if (over.data.current.order.status !== pickedUpOrderColumn.current) {
          return `Order was dropped into column ${column?.title} in position ${
            orderPosition + 1
          } of ${ordersInColumn.length}`;
        }
        return `Order was dropped into position ${orderPosition + 1} of ${
          ordersInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpOrderColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpOrderColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns?.map((col) => (
            <Fragment key={col.id}>
              <BoardColumn
                column={col}
                orders={orders.filter((order) => order.status === col.id)}
              />
            </Fragment>
          ))}
        </SortableContext>
      </BoardContainer>

      {"document" in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                orders={orders.filter(
                  (order) => order.status === activeColumn.id
                )}
              />
            )}
            {activeOrder && <OrderCard order={activeOrder} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    console.log('hey');
    
    if (!hasDraggableData(event.active)) return;
    console.log('hoy');

    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
    } else if (data?.type === "OrderWithItems") {
      setActiveOrder(data.order);
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeId === overId) return;

    const isActiveAOrder = activeData?.type === "OrderWithItems";
    const isOverAOrder = overData?.type === "OrderWithItems";

    // Reordering orders within the same column
    if (isActiveAOrder && isOverAOrder) {
      const activeOrder = orders.find((order) => order.id === activeId);
      const overOrder = orders.find((order) => order.id === overId);

      if (activeOrder && overOrder && activeOrder.status === overOrder.status) {
        const ordersInColumn = orders.filter(
          (order) => order.status === activeOrder.status
        );
        const oldIndex = ordersInColumn.findIndex(
          (order) => order.id === activeId
        );
        const newIndex = ordersInColumn.findIndex(
          (order) => order.id === overId
        );

        const reorderedOrders = arrayMove(ordersInColumn, oldIndex, newIndex);

        const updatedOrders = [
          ...orders.filter((order) => order.status !== activeOrder.status),
          ...reorderedOrders,
        ];
        setOrders(updatedOrders);
      }
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveOrder(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Move order between columns
    if (activeData?.type === "OrderWithItems" && overData?.type === "Column") {
      const updatedOrders = orders.map((order) =>
        order.id === activeId ? { ...order, status: overId as ColumnId } : order
      );
      setOrders(updatedOrders);
    }

    // Move columns
    if (activeData?.type === "Column" && overData?.type === "Column") {
      const oldIndex = columns.findIndex((col) => col.id === activeId);
      const newIndex = columns.findIndex((col) => col.id === overId);

      const reorderedColumns = arrayMove(columns, oldIndex, newIndex);
      // Update the state with reordered columns (adjust if `columns` is managed elsewhere)
      useOrderStore.setState({ columns: reorderedColumns });
    }
  }
}
