import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Active, DataRef, Over } from "@dnd-kit/core";
import { isEqual } from "lodash";

import { env } from "@/env.js";
import { User } from "@clerk/nextjs/server";
import { ColumnDragData } from "@/app/(dashboard)/orders/_components/kanban/board-column";
import { OrderDragData } from "@/app/(dashboard)/orders/_components/kanban/order-card";
import { OrderItem } from "@/db/schema";

type DraggableData = ColumnDragData | OrderDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("es-ES", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "OrderWithItems") {
    return true;
  }

  return false;
}

export function filterCompareArrays(
  existingProducts: any[],
  newProducts: any[]
) {
  const changedOrNewProducts = [];
  const existingProductsMap = new Map(
    existingProducts.map((product) => [product.id, product])
  );

  for (const newProduct of newProducts) {
    const existingProduct = existingProductsMap.get(newProduct.id);
    if (!existingProduct || !isEqual(existingProduct, newProduct)) {
      changedOrNewProducts.push(newProduct);
    }
  }

  return changedOrNewProducts;
}

export function getUserEmail(user: User | null) {
  const email =
    user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";

  return email;
}

export function formatPrice(
  price: number | string,
  options: Intl.NumberFormatOptions = {},
  includeDecimals: boolean = false
) {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  };

  const formatOptions = { ...defaultOptions, ...options };

  const number = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("es-AR", formatOptions).format(number);
}

export function calculateOrderTotals(items: OrderItem[]) {
  return items.reduce(
    (totals, item) => {
      totals.totalQuantity += item.qty;
      totals.totalAmount += parseFloat(item.price ?? "0") * item.qty;
      return totals;
    },
    { totalQuantity: 0, totalAmount: 0 }
  );
}
