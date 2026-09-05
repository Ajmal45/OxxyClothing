import { useState, useEffect } from 'react';
import { storefrontService } from '../../../services/storefrontService';
import useInViewOnce from '../../../hooks/useInViewOnce';
import ProductCard from '../product/ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';
import SectionHeading from '../ui/SectionHeading';

const FeaturedProductsSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ref, inView] = useInViewOnce();

    useEffect(() => {
        if (!inView) return;
        let cancelled = false;
        storefrontService.getFeatured()
            .then((res) => { if (!cancelled) setProducts(res.data.data || []); })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [inView]);

    if (!inView) return <section ref={ref} className="py-20 lg:py-28 px-5 bg-oxxy-light"><div className="h-40" /></section>;
    if (!loading && products.length === 0) return null;

    return (
        <section ref={ref} className="py-20 lg:py-28 px-5 bg-oxxy-light">
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