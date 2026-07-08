export const ProductCardSkeleton = () => (
    <div className="animate-pulse">
        <div className="aspect-[3/4] bg-gray-100" />
        <div className="mt-4 space-y-2 px-1">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
    </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

export const HeroSkeleton = () => (
    <div className="h-screen bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-center space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
            <div className="h-12 w-64 bg-gray-200 rounded mx-auto" />
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto" />
        </div>
    </div>
);

export const SectionSkeleton = ({ className = '' }) => (
    <div className={`animate-pulse ${className}`}>
        <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
        <div className="h-8 w-64 bg-gray-100 rounded" />
    </div>
);