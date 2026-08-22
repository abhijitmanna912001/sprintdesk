interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: Readonly<SkeletonProps>) {
  return (
    <output
      className={`block animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      aria-label="Loading"
    />
  );
}
