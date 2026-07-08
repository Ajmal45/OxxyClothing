import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BrandStorySection = ({ data }) => {
    if (!data?.brandStoryHeading && !data?.brandStoryText) return null;

    return (
        <section className="relative py-20 lg:py-32 px-5 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className={data?.brandStoryImage?.url ? '' : 'lg:col-span-2'}>
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-oxxy-muted mb-4">
                        Our Story
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight mb-6">
                        {data?.brandStoryHeading || 'Our Story'}
                    </h2>
                    <p className="text-base leading-relaxed text-oxxy-gray/80 max-w-lg">
                        {data?.brandStoryText}
                    </p>
                    <Link
                        to="/about"
                        className="inline-flex items-center gap-2 mt-8 text-sm font-semibold tracking-wider uppercase border-b-2 border-oxxy-black pb-1 hover:gap-3 transition-all"
                    >
                        Learn More <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {data?.brandStoryImage?.url && (
                    <div className="relative h-[400px] lg:h-[550px] overflow-hidden">
                        <img
                            src={data.brandStoryImage.url}
                            alt={data.brandStoryImage.altText || 'Brand story'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default BrandStorySection;