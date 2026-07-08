import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { storefrontService } from '../services/storefrontService';
import { injectJsonLd, getCollectionSchema } from '../utils/jsonld';
import ProductGrid from '../components/storefront/product/ProductGrid';
import { Spinner } from '../components/ui';
import { updateSEO } from '../utils/seo';

const CollectionDetailPage = () => {
    const { slug } = useParams();
    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const colRes = await storefrontService.getCollection(slug);
                const col = colRes.data.data || colRes.data;
                if (!cancelled) setCollection(col);

                const prodRes = await storefrontService.getProducts({ collection: slug, limit: 50 });
                if (!cancelled) setProducts(prodRes.data.data || []);
            } catch (err) {
                if (!cancelled) {
                    if (err.response?.status === 404) setError('Collection not found');
                    else setError(err.response?.data?.message || 'Failed to load collection');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [slug]);

    useEffect(() => {
        if (collection) {
            updateSEO({
                title: collection.name,
                description: collection.seoDescription || collection.description || `${collection.name} collection at OXXY.`,
                image: collection.coverImage?.url,
                url: `/collections/${collection.slug}`,
            });

            injectJsonLd(getCollectionSchema(collection));
        }
    }, [collection]);

    if (loading) {
        return (
            <div className="pt-28 pb-20 flex items-center justify-center min-h-[50vh]">
                <Spinner className="h-8 w-8 text-black" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-28 pb-20 px-5 max-w-7xl mx-auto text-center">
                <p className="text-lg text-oxxy-muted mb-4">{error}</p>
                <Link to="/collections" className="text-sm font-medium underline underline-offset-4">
                    Back to Collections
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 lg:pt-28 pb-20">
            {collection?.coverImage?.url && (
                <div className="relative h-[300px] lg:h-[450px] overflow-hidden">
                    <img
                        src={collection.coverImage.url}
                        alt={collection.coverImage.altText || collection.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-oxxy-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 max-w-7xl mx-auto">
                        <h1 className="text-4xl lg:text-6xl font-serif text-oxxy-white">{collection.name}</h1>
                        {collection.description && (
                            <p className="mt-3 text-base text-white/70 max-w-xl">{collection.description}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-5 lg:px-8">
                {!collection?.coverImage?.url && (
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-5xl font-serif">{collection.name}</h1>
                        {collection?.description && (
                            <p className="mt-3 text-base text-oxxy-gray/70 max-w-xl">{collection.description}</p>
                        )}
                    </div>
                )}

                <div className="mt-8">
                    <Link
                        to="/collections"
                        className="inline-flex items-center gap-2 text-sm text-oxxy-muted hover:text-oxxy-black transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Collections
                    </Link>
                </div>

                <ProductGrid products={products} loading={false} />
            </div>
        </div>
    );
};

export default CollectionDetailPage;