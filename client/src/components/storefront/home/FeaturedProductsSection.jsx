import { useState, useEffect } from 'react';
import { storefrontService } from '../../../services/storefrontService';
import ProductCard from '../product/ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';
import SectionHeading from '../ui/SectionHeading';

const FeaturedProductsSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        storefrontService.getFeatured()
            .then((res) => { if (!cancelled) setProducts(res.data.data || []); })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    if (!loading && products.length === 0) return null;

    return (
        <section className="py-20 lg:py-28 px-5 bg-oxxy-light">
            <div className="max-w-7xl mx-auto">
                <SectionHeading
                    label="Featured"
                    heading="Editor's Pick"
                    className="mb-12"
                />
                {loading ? (
                    <ProductGridSkeleton count={4} />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                        {products.slice(0, 8).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProductsSection;