import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateOrderTotals, cn, formatPrice } from "@/lib/utils";
import { OrderWithItems } from "@/types/orders";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import {
  GripVertical,
  Mail,
  Package,
  Calendar,
  DollarSign,
} from "lucide-react";

interface OrderCardProps {
  order: OrderWithItems;
  isOverlay?: boolean;
}

export type OrderType = "OrderWithItems";

export interface OrderDragData {
  type: OrderType;
  order: OrderWithItems;
}

export function OrderCard({ order, isOverlay }: OrderCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: order.id,
    data: {
      type: "OrderWithItems",
      order,
    } satisfies OrderDragData,
    attributes: {
      roleDescription: "Order",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 ring-primary/50 opacity-30",
        overlay: "ring-2 ring-primary shadow-lg",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        }),
        "my-4 transition-all duration-200 hover:shadow-md"
      )}
    >
      <CardHeader className="space-between relative flex flex-row items-center border-b border-secondary px-4 py-3">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50 hover:text-primary transition-colors duration-200"
        >
          <span className="sr-only">Move order</span>
          <GripVertical className="h-5 w-5" />
        </Button>
        <Tooltip>
          <TooltipTrigger className="flex items-start justify-end w-full">
            <Badge
              variant={"secondary"}
              className="ml-auto max-w-60 font-mono text-xs"
            >
              <p className="truncate">{order.id}</p>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{order.id}</TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent className="grid gap-2 px-4 pt-2 pb-4">
        <h3 className="font-semibold text-lg truncate">
          {order.client}
          {order.company && ` - ${order.company}`}
        </h3>
        <div className="grid gap-1 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            <span className="truncate max-w-[16rem]">{order.email}</span>
          </div>
          <div className="flex items-center">
            <Package className="mr-2 h-4 w-4 text-blue-500" />
            <span>
              Cantidad total: {calculateOrderTotals(order.items).totalQuantity}
            </span>
          </div>
          <div className="flex items-center font-medium">
            <DollarSign className="mr-2 h-4 w-4 text-green-500" />
            <span>
              Precio total:{" "}
              {formatPrice(calculateOrderTotals(order.items).totalAmount)}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Created: {new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
