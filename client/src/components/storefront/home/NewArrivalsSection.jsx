import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { storefrontService } from '../../../services/storefrontService';
import ProductCard from '../product/ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';
import SectionHeading from '../ui/SectionHeading';

const NewArrivalsSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        storefrontService.getNewArrivals()
            .then((res) => { if (!cancelled) setProducts(res.data.data || []); })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    if (!loading && products.length === 0) return null;

    return (
        <section className="py-20 lg:py-28 px-5 bg-oxxy-light">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <SectionHeading
                        label="New Arrivals"
                        heading="Fresh Off The Runway"
                        align="left"
                    />
                    <Link
                        to="/new-arrivals"
                        className="hidden sm:flex items-center gap-2 text-sm font-medium tracking-wider uppercase hover:gap-3 transition-all"
                    >
                        View All <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {loading ? (
                    <ProductGridSkeleton count={4} />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                        {products.slice(0, 8).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                <div className="mt-10 text-center sm:hidden">
                    <Link
                        to="/new-arrivals"
                        className="inline-flex items-center gap-2 text-sm font-medium tracking-wider uppercase"
                    >
                        View All New Arrivals <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NewArrivalsSection;