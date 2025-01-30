"use client";

import axios from "axios";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
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

import { ColumnId, useOrderStore } from "@/lib/store";
import { hasDraggableData } from "@/lib/utils";
import { OrderWithItems } from "@/types/orders";
import { OrderStatus } from "@/db/schema";

import type { Column } from "./board-column";
import { BoardColumn, BoardContainer } from "./board-column";
import { OrderCard } from "./order-card";

interface KanbanBoardProps {
  data: OrderWithItems[];
}

export function KanbanBoard({ data }: KanbanBoardProps) {
  // const [columns, setColumns] = useState<Column[]>(defaultCols);
  const initializeData = useOrderStore((state) => state.initializeData);
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
    // Initialize store with data
    initializeData(data);
    setIsMounted(true);
  }, [data, initializeData, isMounted]);

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

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      const response = await axios.put("/api/order-status", {
        orderId,
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw new Error("Failed to update order status");
    }
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
    if (!hasDraggableData(event.active)) return;

    const data = event.active.data.current;

    if (data?.type === "OrderWithItems") {
      const activeOrder = data.order;

      if (activeOrder.status === "pending") {
        toast.error("No puedes mover órdenes con estado 'Presupuestado'.", {
          description: "Solo puedes actualizar dando de alta el presupuesto.",
        });
        return;
      }

      // Si no es "requested", permitimos el arrastre
      setActiveOrder(activeOrder);
    } else if (data?.type === "Column") {
      setActiveColumn(data.column);
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
      const activeIndex = orders.findIndex((t) => t.id === activeId);
      const overIndex = orders.findIndex((t) => t.id === overId);
      const activeOrder = orders[activeIndex];
      const overOrder = orders[overIndex];

      if (activeOrder && overOrder && activeOrder.status !== overOrder.status) {
        activeOrder.status = overOrder.status;
        setOrders(arrayMove(orders, activeIndex, overIndex - 1));
      }

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

      setOrders(arrayMove(orders, activeIndex, overIndex));
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveOrder(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "OrderWithItems" && overData?.type === "Column") {
      const activeOrder = activeData.order;

      // Verificar si la orden tiene estado "pending"
      if (activeOrder.status === "pending") {
        return; // Detenemos el cambio de estado
      }

      const updatedOrders = orders.map((order) =>
        order.id === activeId
          ? { ...order, status: overId as OrderStatus }
          : order
      );

      // Actualizar estado local
      setOrders(updatedOrders);

      // Llamar a la API para actualizar la base de datos
      try {
        await updateOrderStatus(activeId as string, overId as string);
        toast.message("Éxito!", {
          description: `Tu orden fue actualizada!`,
        });
        console.log(`Order ${activeId} status updated to ${overId}`);
      } catch (error) {
        console.error(`Failed to update order ${activeId} status:`, error);
        toast.error("Error!", {
          description: `Tu orden no pudo ser actualizada, intente nuevamente!`,
        });
      }
    }

    if (
      activeData?.type === "OrderWithItems" &&
      overData?.type !== "Column" &&
      over.data.current
    ) {
      const overStatus = over.data.current.order.status;

      // Verificar si la orden tiene estado "pending"
      if (overStatus === "pending") {
        return; // Detenemos el cambio de estado
      }

      const updatedOrders = orders.map((order) =>
        order.id === activeId
          ? { ...order, status: overStatus as OrderStatus }
          : order
      );

      // Actualizar estado local
      setOrders(updatedOrders);

      // Llamar a la API para actualizar la base de datos
      try {
        await updateOrderStatus(activeId as string, overStatus as string);
        toast.message("Éxito!", {
          description: `Tu orden fue actualizada!`,
        });
        console.log(`Order ${activeId} status updated to ${overStatus}`);
      } catch (error) {
        console.error(`Failed to update order ${activeId} status:`, error);
        toast.error("Error!", {
          description: `Tu orden no pudo ser actualizada, intente nuevamente!`,
        });
      }
    }
  }
}
