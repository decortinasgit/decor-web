import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { persist } from "zustand/middleware";
import { UniqueIdentifier } from "@dnd-kit/core";
import { OrderWithItems } from "@/types/orders";
import { Column } from "@/app/(dashboard)/orders/_components/kanban/board-column";

export const defaultStatusCols = [
  { id: "pending", title: "Pendiente" },
  { id: "processing", title: "Procesando" },
  { id: "production", title: "En producción" },
  { id: "shipped", title: "Enviado" },
  { id: "delivered", title: "Entregado" },
  { id: "completed", title: "Completado" },
] satisfies Column[];

export type ColumnId = (typeof defaultStatusCols)[number]["id"];

export type State = {
  orders: OrderWithItems[];
  columns: Column[];
  draggedOrder: string | null;
};

const initialOrders: OrderWithItems[] = [];

export type Actions = {
  addOrder: (
    order: Omit<OrderWithItems, "id" | "createdAt" | "updatedAt">
  ) => void;
  initializeData: (data: OrderWithItems[]) => void;
  addCol: (title: string) => void;
  dragOrder: (id: string | null) => void;
  removeOrder: (id: string) => void;
  removeCol: (id: UniqueIdentifier) => void;
  setOrders: (updatedOrder: OrderWithItems[]) => void;
  setCols: (cols: Column[]) => void;
  updateCol: (id: UniqueIdentifier, newName: string) => void;
};

export const useOrderStore = create<State & Actions>()(
  persist(
    (set) => ({
      orders: initialOrders,
      columns: defaultStatusCols,
      draggedOrder: null,
      initializeData: (data: OrderWithItems[]) =>
        set(() => ({
          orders: data,
        })),
      addOrder: (
        order: Omit<OrderWithItems, "id" | "createdAt" | "updatedAt">
      ) =>
        set((state) => ({
          orders: [
            ...state.orders,
            {
              ...order,
              id: uuid(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateCol: (id: UniqueIdentifier, newName: string) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title: newName } : col
          ),
        })),
      addCol: (title: string) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              title,
              id: state.columns.length ? title.toUpperCase() : "Pendiente",
            },
          ],
        })),
      dragOrder: (id: string | null) => set({ draggedOrder: id }),
      removeOrder: (id: string) =>
        set((state) => {
          const updatedState = {
            ...state,
            orders: state.orders.filter((order) => order.id !== id),
          };
          return updatedState;
        }, true),
      removeCol: (id: UniqueIdentifier) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
        })),
      setOrders: (newOrders: OrderWithItems[]) =>
        set((state) => {
          const updatedState = { ...state, orders: newOrders };
          return updatedState;
        }, true),
      setCols: (newCols: Column[]) => set({ columns: newCols }),
    }),
    { name: "order-store", skipHydration: true }
  )
);
