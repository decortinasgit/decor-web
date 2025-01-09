import Image from "next/image";

import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OrderWithItems } from "@/types/orders";
import { formatPrice } from "@/lib/utils";

interface ProductsDialogProps {
  orderProduct: OrderWithItems;
}

export function ProductsDialog({ orderProduct }: ProductsDialogProps) {
  return (
    <AlertDialogContent className="max-w-screen-md max-h-[70vh] overflow-hidden">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Productos para:{" "}
          {orderProduct.company ? orderProduct.company + " - " : ""}
          {orderProduct.client}
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col gap-2 overflow-y-auto max-h-[calc(50vh-6rem)]">
          {orderProduct.items?.length > 0 &&
            orderProduct.items
              .filter((item) => item !== null)
              .map((item, index) => {
                return (
                  <div key={index} className="capitalize border rounded-md p-2">
                    <div className="flex items-center gap-2">
                      ({item.qty}) <strong className="mr-1">{item.name}</strong>
                      <span className="truncate">
                        {item.price ? formatPrice(item.price) : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction>Volver</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
