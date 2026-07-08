import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { storefrontService } from '../../../services/storefrontService';
import SectionHeading from '../ui/SectionHeading';

const STORAGE_KEY = 'oxxy_recently_viewed';
const MAX_ITEMS = 8;

export const addRecentlyViewed = (product) => {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const filtered = stored.filter((p) => p._id !== product._id);
        filtered.unshift({ _id: product._id, slug: product.slug });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
    } catch { /* ignore */ }
};

const RecentlyViewed = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const slugs = stored.slice(0, 4).map((p) => p.slug);
            if (slugs.length === 0) {
                setLoading(false);
                return;
            }

            Promise.all(slugs.map((slug) =>
                storefrontService.getProduct(slug).then((r) => r.data.data || r.data).catch(() => null)
            )).then((results) => {
                setProducts(results.filter(Boolean));
            }).finally(() => setLoading(false));
        } catch {
            setLoading(false);
        }
    }, []);

    if (!loading && products.length === 0) return null;

    if (loading) return null;

    return (
        <section className="mt-16">
            <SectionHeading
                heading="Recently Viewed"
                align="left"
                className="mb-8"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewed;