import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface KanbanBoardSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The number of columns (lists) in the Kanban board.
   * @type number
   */
  columnCount: number;

  /**
   * The number of cards per column.
   * @default 3
   * @type number | undefined
   */
  cardsPerColumn?: number;

  /**
   * Flag to show a title skeleton for each column.
   * @default true
   * @type boolean | undefined
   */
  showColumnTitles?: boolean;

  /**
   * Custom width for each column.
   * Any valid CSS width value is accepted.
   * @default "250px"
   * @type string | undefined
   */
  columnWidth?: string;

  /**
   * The height of the skeleton cards.
   * @default "80px"
   * @type string | undefined
   */
  cardHeight?: string;
}

export function KanbanBoardSkeleton(props: KanbanBoardSkeletonProps) {
  const {
    columnCount,
    cardsPerColumn = 3,
    showColumnTitles = true,
    columnWidth = "250px",
    cardHeight = "80px",
    className,
    ...skeletonProps
  } = props;

  return (
    <div
      className={cn("flex w-full space-x-4 overflow-auto p-2", className)}
      {...skeletonProps}
    >
      {Array.from({ length: columnCount }).map((_, columnIndex) => (
        <div
          key={columnIndex}
          className="flex flex-col space-y-4"
          style={{ width: columnWidth }}
        >
          {showColumnTitles ? (
            <Skeleton className="h-6 w-3/4 rounded-md mx-auto" />
          ) : null}
          <div className="flex flex-col space-y-3">
            {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
              <Skeleton
                key={cardIndex}
                className="w-full rounded-md"
                style={{ height: cardHeight }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
