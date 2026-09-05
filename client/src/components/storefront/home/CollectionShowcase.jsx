import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { storefrontService } from '../../../services/storefrontService';
import useInViewOnce from '../../../hooks/useInViewOnce';
import { optimizeImageUrl } from '../../../utils/image';
import { SectionSkeleton } from '../ui/Skeleton';
import SectionHeading from '../ui/SectionHeading';

const CollectionShowcase = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ref, inView] = useInViewOnce();

    useEffect(() => {
        if (!inView) return;
        let cancelled = false;
        storefrontService.getCollections()
            .then((res) => { if (!cancelled) setCollections(res.data.data || []); })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [inView]);

    if (!inView) return <section ref={ref} className="py-20 lg:py-28 px-5"><div className="h-40" /></section>;
    if (!loading && collections.length === 0) return null;

    return (
        <section ref={ref} className="py-20 lg:py-28 px-5">
            <div className="max-w-7xl mx-auto">
                <SectionHeading
                    label="Collections"
                    heading="Curated For You"
                    className="mb-12"
                />

                {loading ? (
                    <SectionSkeleton className="h-64" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {collections.slice(0, 6).map((col) => (
                            <Link
                                key={col._id}
                                to={`/collections/${col.slug}`}
                                className="group relative h-[400px] lg:h-[500px] overflow-hidden bg-gray-100"
                            >
                                {col.coverImage?.url ? (
                                    <img
                                        src={optimizeImageUrl(col.coverImage.url, 700)}
                                        alt={col.coverImage.altText || col.name}
                                        width="700"
                                        height="875"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-oxxy-black">
                                        <span className="text-oxxy-white text-lg font-serif">{col.name}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-oxxy-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                                    <h3 className="text-xl lg:text-2xl font-serif text-oxxy-white mb-1">
                                        {col.name}
                                    </h3>
                                    {col.description && (
                                        <p className="text-sm text-white/70 line-clamp-2">{col.description}</p>
                                    )}
                                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold tracking-wider uppercase text-oxxy-white border-b border-white/50 pb-0.5 group-hover:gap-2 transition-all">
                                        Explore <ArrowRight className="h-3 w-3" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CollectionShowcase;