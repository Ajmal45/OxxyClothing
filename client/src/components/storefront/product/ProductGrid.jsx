import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';

const ProductGrid = ({ products, loading, emptyMessage = 'No products found.' }) => {
    if (loading) return <ProductGridSkeleton />;
    if (!products || products.length === 0) {
        return (
            <div className="col-span-full text-center py-20">
                <p className="text-base text-oxxy-muted">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
