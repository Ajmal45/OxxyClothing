import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Shirt } from 'lucide-react';
import useGsapAnimation from '../../../hooks/useGsapAnimation';

const HeroSection = ({ data }) => {
    const heroMedia = data?.heroMedia;
    const isVideo = heroMedia?.type === 'video';

    const sectionRef = useGsapAnimation((el, gsap) => {
        const children = el.querySelectorAll('[data-animate]');
        if (children.length === 0) return;
        gsap.fromTo(children,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.2,
            }
        );
    }, []);

    const features = [
        { icon: Sparkles, label: 'Premium\nQuality' },
        { icon: Leaf, label: 'Stylish\nDesigns' },
        { icon: Shirt, label: "Complete\nWomen's Wear" },
    ];

    return (
        <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
            {isVideo ? (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={heroMedia?.url}
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={heroMedia?.url} type="video/mp4" />
                </video>
            ) : (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: heroMedia?.url ? `url(${heroMedia.url})` : undefined }}
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-28">
                <div className="max-w-2xl">
                    <p data-animate className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-oxxy-black/70 mb-4">
                        {data?.heroSubtitle || 'Elevate Your Style'}
                    </p>

                    <h1 data-animate className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-oxxy-black leading-[0.95]">
                        {(data?.heroHeading || 'Elegance')}{' '}
                        <span className="text-oxxy-gold italic font-light">&amp;</span>
                        <br />
                        {'Redefined'}
                    </h1>

                    <p data-animate className="mt-6 text-base md:text-lg text-oxxy-black/60 max-w-md leading-relaxed">
                        Timeless fashion crafted for the modern woman.
                    </p>

                    <div data-animate className="mt-8">
                        <Link
                            to={data?.heroCTALink || '/collections'}
                            className="inline-block px-8 py-4 bg-oxxy-black text-oxxy-white text-sm font-semibold tracking-[0.2em] uppercase hover:bg-oxxy-dark transition-colors"
                        >
                            {data?.heroCTA || 'Explore Collection'}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-10 bg-oxxy-black/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-center gap-12 sm:gap-20">
                    {features.map((feat, i) => (
                        <div key={i} data-animate className="flex flex-col items-center gap-2 text-center">
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
