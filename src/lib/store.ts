import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { persist } from "zustand/middleware";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Column } from "@/app/(dashboard)/orders/_components/board-column";
import { OrderWithItems } from "@/types/orders";

export const defaultCols = [
  { id: "pending", title: "Pendiente" },
  { id: "processing", title: "Procesando" },
  { id: "production", title: "En producción" },
  { id: "shipped", title: "Enviado" },
  { id: "delivered", title: "Entregado" },
  { id: "completed", title: "Completado" },
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"];

export type State = {
  orders: OrderWithItems[];
  columns: Column[];
  draggedOrder: string | null;
};

const initialOrders: OrderWithItems[] = [
  {
    id: "2e590737-d802-447a-8391-c0415a802f50",
    company: "Decortinas",
    client: "Facundo Teran",
    email: "molporron@gmail.com",
    status: "pending",
    createdAt: new Date("2024-11-21T02:18:49.318Z"),
    updatedAt: new Date("2024-11-21T02:18:49.318Z"),
    items: [], // Adjust as needed
  },
];

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
      columns: defaultCols,
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
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        })),
      removeCol: (id: UniqueIdentifier) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
        })),
      setOrders: (newOrders: OrderWithItems[]) => set({ orders: newOrders }),
      setCols: (newCols: Column[]) => set({ columns: newCols }),
    }),
    { name: "order-store", skipHydration: true }
  )
);
