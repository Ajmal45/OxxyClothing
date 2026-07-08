import useGsapAnimation from '../../../hooks/useGsapAnimation';

const ScrollReveal = ({ children, className, delay = 0, duration = 0.8, y = 60 }) => {
    const ref = useGsapAnimation((el, gsap) => {
        const targets = el.children;
        if (targets.length === 0) return;
        gsap.fromTo(targets,
            { y, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration,
                stagger: 0.15,
                delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }, [delay, duration, y]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

export default ScrollReveal;
