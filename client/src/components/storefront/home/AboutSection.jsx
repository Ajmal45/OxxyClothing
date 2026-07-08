import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AboutSection = ({ data }) => {
    if (!data?.aboutText && !data?.aboutImage?.url) return null;

    return (
        <section className="py-20 lg:py-28 px-5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {data?.aboutImage?.url && (
                    <div className="relative h-[350px] lg:h-[500px] overflow-hidden order-2 lg:order-1">
                        <img
                            src={data.aboutImage.url}
                            alt="About OXXY"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                )}
                <div className={data?.aboutImage?.url ? 'order-1 lg:order-2' : 'lg:col-span-2 text-center'}>
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-oxxy-muted mb-4">
                        About
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight mb-6">
                        {data?.aboutText ? 'Our World' : 'About OXXY'}
                    </h2>
                    {data?.aboutText && (
                        <p className="text-base leading-relaxed text-oxxy-gray/80 max-w-lg">
                            {data.aboutText}
                        </p>
                    )}
                    <Link
                        to="/about"
                        className="inline-flex items-center gap-2 mt-8 text-sm font-semibold tracking-wider uppercase border-b-2 border-oxxy-black pb-1 hover:gap-3 transition-all"
                    >
                        Know More <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;