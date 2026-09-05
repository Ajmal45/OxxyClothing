import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Shirt } from 'lucide-react';
import { optimizeImageUrl } from '../../../utils/image';
import defaultHero from '../../../assets/hero.png';

const HeroSection = ({ data }) => {
    const heroMedia = data?.heroMedia;
    const isVideo = heroMedia?.type === 'video';
    const heroSrc = heroMedia?.url || defaultHero;

    const features = [
        { icon: Sparkles, label: 'Premium\nQuality' },
        { icon: Leaf, label: 'Stylish\nDesigns' },
        { icon: Shirt, label: "Complete\nWomen's Wear" },
    ];

    return (
        <section className="relative min-h-[620px] sm:min-h-[760px] h-[100svh] w-full overflow-hidden bg-oxxy-light">
            {isVideo ? (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={optimizeImageUrl(heroMedia?.url, 1200)}
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={heroMedia?.url} type="video/mp4" />
                </video>
            ) : (
                <img
                    src={optimizeImageUrl(heroSrc, 1200)}
                    srcSet={`${optimizeImageUrl(heroSrc, 800)} 800w, ${optimizeImageUrl(heroSrc, 1200)} 1200w, ${optimizeImageUrl(heroSrc, 1600)} 1600w`}
                    sizes="100vw"
                    alt=""
                    aria-hidden="true"
                    fetchpriority="high"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-[#e8e1d7]/95 via-[#e8e1d7]/70 to-transparent" />
            <div className="absolute hidden lg:block right-[10%] top-[12%] h-[66%] w-[32%] rounded-t-[18rem] border border-oxxy-gold/60 bg-oxxy-white/10" />

            <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-28">
                <div className="max-w-2xl hero-entrance">
                    <div className="mb-7 flex items-center gap-3 text-oxxy-gold">
                        <span className="grid h-9 w-9 place-items-center rounded-full border border-current font-serif text-lg">O</span>
                        <span className="text-[10px] font-semibold tracking-[0.32em] uppercase">The OXXY Edit</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-oxxy-black/70 mb-4">
                        {data?.heroSubtitle || 'Elevate Your Style'}
                    </p>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-oxxy-black leading-[0.95]">
                        {(data?.heroHeading || 'Elegance')}{' '}
                        <span className="text-oxxy-gold italic font-light">&amp;</span>
                        <br />
                        {'Redefined'}
                    </h1>

                    <p className="mt-6 text-xl md:text-2xl font-editorial text-oxxy-black/70 max-w-md leading-relaxed">
                        Timeless fashion crafted for the modern woman.
                    </p>

                    <div className="mt-8">
                        <Link
                            to={data?.heroCTALink || '/collections'}
                            className="inline-block px-8 py-4 bg-oxxy-black text-oxxy-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-oxxy-gold transition-colors"
                        >
                            {data?.heroCTA || 'Explore Collection'}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/35 bg-[#1a1a1a]/90 sm:bg-[#1a1a1a]/75 sm:backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-center gap-12 sm:gap-20">
                    {features.map((feat, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 text-center">
                            <feat.icon className="h-5 w-5 text-oxxy-white/70" strokeWidth={1.5} />
                            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-oxxy-white/80 whitespace-pre-line leading-tight">
                                {feat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
