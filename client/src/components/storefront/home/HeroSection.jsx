import { Link } from 'react-router-dom';
import { ArrowDown, MessageCircle } from 'lucide-react';
import useGsapAnimation from '../../../hooks/useGsapAnimation';
import useWhatsAppNumber from '../../../hooks/useWhatsAppNumber';

const HeroSection = ({ data }) => {
    const heroMedia = data?.heroMedia;
    const isVideo = heroMedia?.type === 'video';
    const { url: whatsappUrl } = useWhatsAppNumber();

    const sectionRef = useGsapAnimation((el, gsap) => {
        const children = el.querySelectorAll('[data-animate]');
        if (children.length === 0) return;
        gsap.fromTo(children,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                delay: 0.3,
            }
        );
    }, []);

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
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: heroMedia?.url ? `url(${heroMedia.url})` : undefined }}
                />
            )}

            <div className="absolute inset-0 bg-oxxy-black/50" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5">
                <p data-animate className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase text-white/80 mb-6">
                    OXXY
                </p>
                <h1 data-animate className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif text-oxxy-white leading-tight max-w-4xl">
                    {data?.heroHeading || 'Complete Women Store'}
                </h1>
                {data?.heroSubtitle && (
                    <p data-animate className="mt-6 text-base md:text-lg text-white/70 max-w-xl leading-relaxed">
                        {data.heroSubtitle}
                    </p>
                )}
                <div data-animate className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <Link
                        to={data?.heroCTALink || '/collections'}
                        className="px-8 py-3.5 bg-oxxy-white text-oxxy-black text-sm font-semibold tracking-wider uppercase hover:bg-oxxy-light transition-colors"
                    >
                        {data?.heroCTA || 'Explore Collection'}
                    </Link>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-8 py-3.5 border border-white/30 text-oxxy-white text-sm font-semibold tracking-wider uppercase hover:bg-white/10 transition-colors"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Enquire
                    </a>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                <ArrowDown className="h-5 w-5 text-white/60" />
            </div>
        </section>
    );
};

export default HeroSection;
