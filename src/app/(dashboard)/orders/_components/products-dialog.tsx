import {
  AlertDialogAction,
  AlertDialogContent,
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
    <AlertDialogContent className="max-w-4xl max-h-[70vh] flex flex-col">
      <AlertDialogHeader>
        <AlertDialogTitle>
          Productos para:{" "}
          {orderProduct.company ? orderProduct.company + " - " : ""}
          {orderProduct.client}
        </AlertDialogTitle>
      </AlertDialogHeader>

      {/* Contenedor scrollable */}
      <div className="flex-1 overflow-auto p-2">
        {orderProduct.items?.length > 0 ? (
          <CurtainsTable
            data={orderProduct.items}
            pageCount={1}
            hideActions
            deleteRow={() => {}}
            duplicateRow={() => {}}
          />
        ) : (
          <p className="text-center text-gray-500">No hay productos.</p>
        )}
      </div>

      <AlertDialogFooter>
        <AlertDialogAction>Volver</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}