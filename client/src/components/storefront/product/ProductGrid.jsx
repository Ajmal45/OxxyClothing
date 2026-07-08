import useGsapAnimation from '../../../hooks/useGsapAnimation';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../ui/Skeleton';

const ProductGrid = ({ products, loading, emptyMessage = 'No products found.' }) => {
    const ref = useGsapAnimation((el, gsap) => {
        const cards = el.querySelectorAll(':scope > *');
        if (cards.length === 0) return;
        gsap.fromTo(cards,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 92%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }, []);

    if (loading) return <ProductGridSkeleton />;
    if (!products || products.length === 0) {
        return (
            <div className="col-span-full text-center py-20">
                <p className="text-base text-oxxy-muted">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;