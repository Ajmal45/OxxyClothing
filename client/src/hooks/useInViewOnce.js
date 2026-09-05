import { useEffect, useRef, useState } from 'react';

// Returns [ref, inView]: inView flips true once the element scrolls near the
// viewport. Used to defer below-fold API fetches until the user scrolls down.
const useInViewOnce = (rootMargin = '400px 0px') => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setInView(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin, threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin]);

    return [ref, inView];
};

export default useInViewOnce;
