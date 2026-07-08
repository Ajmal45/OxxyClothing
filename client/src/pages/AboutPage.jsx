import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHomepage } from '../hooks/useStorefrontData';
import { updateSEO } from '../utils/seo';
import { Spinner } from '../components/ui';

const AboutPage = () => {
    const { data, loading } = useHomepage();

    useEffect(() => {
        updateSEO({ title: 'About Us', description: 'Learn more about OXXY and our journey.' });
    }, []);

    if (loading) {
        return <div className="pt-28 pb-20 flex items-center justify-center min-h-[50vh]"><Spinner className="h-8 w-8 text-black" /></div>;
    }

    return (
        <div className="pt-24 lg:pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-5 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-oxxy-muted mb-4">About</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-6">
                        {data?.brandStoryHeading || 'Our Story'}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
                    {data?.brandStoryImage?.url && (
                        <div className="relative h-[400px] lg:h-[600px] overflow-hidden">
                            <img
                                src={data.brandStoryImage.url}
                                alt={data.brandStoryImage.altText || 'Brand story'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className={data?.brandStoryImage?.url ? '' : 'lg:col-span-2 max-w-2xl mx-auto text-center'}>
                        {data?.brandStatement && (
                            <p className="text-2xl md:text-3xl font-serif leading-tight mb-8 text-oxxy-black/80">
                                &ldquo;{data.brandStatement}&rdquo;
                            </p>
                        )}
                        <p className="text-base leading-relaxed text-oxxy-gray/80">
                            {data?.aboutText || data?.brandStoryText || 'OXXY is a complete women\'s fashion store offering premium clothing and accessories.'}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-10">
                            <Link
                                to="/collections"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-oxxy-black text-oxxy-white text-sm font-semibold tracking-wider uppercase hover:bg-oxxy-gray transition-colors"
                            >
                                Explore Collections <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-8 py-3.5 border border-oxxy-black/20 text-sm font-semibold tracking-wider uppercase hover:border-oxxy-black transition-colors"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </div>
                </div>

                {data?.aboutImage?.url && (
                    <div className="relative h-[300px] lg:h-[500px] overflow-hidden mb-20">
                        <img
                            src={data.aboutImage.url}
                            alt="About OXXY"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutPage;