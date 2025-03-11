import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

export function PDFSkeleton() {
  return (
    <div className="w-full animate-pulse justify-center items-center">
      {/* Header skeleton */}
      <Skeleton className="h-8 w-3/4 mb-6" />

      {/* Content lines */}
      <div className="space-y-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${
              i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-5/6" : "w-4/6"
            }`}
          />
        ))}
      </div>

      {/* Image placeholder */}
      <Skeleton className="h-40 w-full my-6" />

      {/* More content lines */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i + 12}
            className={`h-4 ${
              i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-5/6" : "w-4/6"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
