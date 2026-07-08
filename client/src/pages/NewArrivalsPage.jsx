import { useState, useEffect } from 'react';
import { storefrontService } from '../services/storefrontService';
import ProductGrid from '../components/storefront/product/ProductGrid';
import SectionHeading from '../components/storefront/ui/SectionHeading';
import { updateSEO } from '../utils/seo';

const NewArrivalsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        updateSEO({ title: 'New Arrivals', description: 'Discover the latest new arrivals at OXXY.' });

        let cancelled = false;
        storefrontService.getProducts({ isNewArrival: 'true', sort: 'NEWEST', limit: 50 })
            .then((res) => { if (!cancelled) setProducts(res.data.data || []); })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="pt-24 lg:pt-28 pb-20 px-5">
            <div className="max-w-7xl mx-auto">
                <SectionHeading
                    label="New Arrivals"
                    heading="Fresh Off The Runway"
                    align="left"
                    className="mb-12"
                />
                <ProductGrid products={products} loading={loading} />
            </div>
        </div>
    );
};

export default NewArrivalsPage;