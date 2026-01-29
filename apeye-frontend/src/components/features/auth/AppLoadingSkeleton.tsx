import { Skeleton } from "@/components/ui/skeleton"

export default function AppLoadingSkeleton() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header Skeleton */}
      <header className="h-14 border-b flex items-center justify-between px-2 sm:px-4 bg-card">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Skeleton className="h-4 w-24 hidden sm:block" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="hidden md:block w-64 lg:w-80 border-r bg-sidebar">
          {/* Tabs */}
          <div className="w-full grid grid-cols-2 border-b p-1 gap-1">
            <Skeleton className="h-9 rounded-md" />
            <Skeleton className="h-9 rounded-md" />
          </div>
          
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          {/* Collection Items */}
          <div className="p-2 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 p-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Request Builder Skeleton */}
          <div className="h-[30%] min-h-[120px] border-b p-4 space-y-4">
            {/* URL Bar */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-md" />
              ))}
            </div>

            {/* Content area */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Resizable Handle */}
          <div className="h-2 flex items-center justify-center bg-border/50">
            <Skeleton className="h-1 w-8 rounded-full" />
          </div>

          {/* Response Viewer Skeleton */}
          <div className="flex-1 p-4 space-y-4">
            {/* Response Header */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Response Tabs */}
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-md" />
              ))}
            </div>

            {/* Response Content */}
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
