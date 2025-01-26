import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OrderWithItems } from "@/types/orders";
import { CurtainsTable } from "../../budget/_components/curtains-table/curtains-table";

interface ProductsDialogProps {
  orderProduct: OrderWithItems;
}

export function ProductsDialog({ orderProduct }: ProductsDialogProps) {
  return (
    <AlertDialogContent className="max-w-max max-h-[70vh] overflow-hidden">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Productos para:{" "}
          {orderProduct.company ? orderProduct.company + " - " : ""}
          {orderProduct.client}
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col gap-2 overflow-y-auto max-h-[calc(50vh-6rem)]">
          {orderProduct.items?.length > 0 && (
            <CurtainsTable
              data={orderProduct.items}
              pageCount={1}
              hideActions
              deleteRow={() => {}}
              duplicateRow={() => {}}
            />
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction>Volver</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
