import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useGsapAnimation = (callback, deps = []) => {
    const ref = useRef(null);
    const ctxRef = useRef(null);

    useEffect(() => {
        const triggers = [];
        const mm = gsap.matchMedia();
        ctxRef.current = gsap.context(() => {
            mm.add('(prefers-reduced-motion: no-preference)', () => {
                if (ref.current) {
                    const originalCreate = ScrollTrigger.create.bind(ScrollTrigger);
                    ScrollTrigger.create = (vars) => {
                        const trigger = originalCreate(vars);
                        triggers.push(trigger);
                        return trigger;
                    };
                    callback(ref.current, gsap, ScrollTrigger);
                    ScrollTrigger.create = originalCreate;
                }
            });
        }, ref);

        return () => {
            triggers.forEach((st) => st.kill());
            ctxRef.current?.revert();
            mm.revert();
        };
    }, deps);

    return ref;
};

export default useGsapAnimation;