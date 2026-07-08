import { useState, useEffect } from 'react';
import { storefrontService } from '../../../services/storefrontService';
import ProductCard from './ProductCard';
import SectionHeading from '../ui/SectionHeading';

const RelatedProducts = ({ category, collection, excludeId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const params = { limit: 8 };
        if (category) params.category = category;
        if (collection) params.collection = collection;

        storefrontService.getProducts(params)
            .then((res) => {
                if (!cancelled) {
                    const all = res.data.data || [];
                    setProducts(all.filter((p) => p._id !== excludeId).slice(0, 4));
                }
            })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [category, collection, excludeId]);

    if (!loading && products.length === 0) return null;
    if (loading) return null;

    return (
        <section className="mt-16">
            <SectionHeading heading="You May Also Like" align="left" className="mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;