import React from "react";

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <SkeletonBox className="h-6 w-40" />
        <SkeletonBox className="h-10 w-36 rounded-md" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-gray-100 space-y-4"
            >
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-8 w-16" />
              <SkeletonBox className="h-4 w-20" />
            </div>
          ))}
      </div>

      {/* Funnel / Chart section */}
      <div className="p-6 rounded-xl border border-gray-100 space-y-6">
        <SkeletonBox className="h-5 w-56" />
        <SkeletonBox className="h-4 w-72" />

        <div className="space-y-5 mt-6">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <SkeletonBox className="h-4 w-36" />
                <SkeletonBox className="h-4 flex-1 max-w-[300px]" />
                <SkeletonBox className="h-4 w-12" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
