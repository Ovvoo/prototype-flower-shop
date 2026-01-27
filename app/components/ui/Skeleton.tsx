// Skeleton Component
// Loading state placeholders for different UI elements

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
  )
}

// Pre-built skeleton variants

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <Skeleton className="h-64" />
      <div className="p-6">
        <Skeleton className="h-6 mb-2" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-gray-100 p-8 rounded-2xl">
      <Skeleton className="w-16 h-16 rounded-full mb-4" />
      <Skeleton className="h-6 mb-2" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Skeleton className="h-[500px] rounded-xl mb-4" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-24 h-24 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-16 w-1/3" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  )
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  )
}
