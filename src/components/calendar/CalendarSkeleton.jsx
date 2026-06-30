import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarSkeleton() {
  return (
    <div className="p-4 md:p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="grid grid-cols-7 border-b border-border">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="py-2 flex justify-center border-r border-border last:border-r-0">
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="min-h-[90px] border-b border-r border-border last:border-r-0 p-1.5 space-y-1">
              <Skeleton className="h-4 w-6 ml-auto" />
              {i % 4 === 0 && <Skeleton className="h-5 w-full rounded" />}
              {i % 7 === 0 && <Skeleton className="h-5 w-4/5 rounded" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}