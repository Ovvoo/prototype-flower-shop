export function FiltersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
