import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface KanbanBoardSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns in the Kanban board.
   */
  columnCount: number;

  /**
   * Number of cards per column.
   */
  cardsPerColumn?: number;

  /**
   * Width of each column.
   */
  columnWidth?: string;

  /**
   * Height of each card.
   */
  cardHeight?: string;

  /**
   * Whether to show column headers.
   */
  showColumnHeaders?: boolean;
}

export function KanbanBoardSkeleton({
  columnCount,
  cardsPerColumn = 3,
  columnWidth = "250px",
  cardHeight = "120px",
  showColumnHeaders = true,
  className,
  ...props
}: KanbanBoardSkeletonProps) {
  return (
    <div
      className={cn("flex w-full space-x-4 overflow-auto p-4", className)}
      {...props}
    >
      {Array.from({ length: columnCount }).map((_, columnIndex) => (
        <div
          key={columnIndex}
          className="flex flex-col space-y-4 bg-gray-100 p-4 rounded-md"
          style={{ width: columnWidth }}
        >
          {showColumnHeaders && (
            <Skeleton className="h-6 w-2/3 mx-auto rounded-full bg-yellow-300" />
          )}
          <div className="space-y-3">
            {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="p-3 rounded-md shadow-sm bg-white border border-gray-200 space-y-2"
                style={{ height: cardHeight }}
              >
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
