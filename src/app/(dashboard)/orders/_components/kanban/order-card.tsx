import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrderWithItems } from "@/types/orders";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";

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
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="space-between relative flex flex-row border-b-2 border-secondary px-3 py-3">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50"
        >
          <span className="sr-only">Move order</span>
          <GripVertical />
        </Button>
        <Badge variant={"outline"} className="ml-auto max-w-24 font-semibold">
          <p className="truncate">{order.id}</p>
        </Badge>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap px-3 pb-6 pt-3 text-left">
        <p>{order.client}</p>
        <p className="text-sm text-muted-foreground">{order.email}</p>
        <p>Cantidad: {order.items.length}</p>
      </CardContent>
    </Card>
  );
}
