import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Loader = ({ isLoading }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => setShow(false), 800);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="fixed inset-0 z-[100] bg-oxxy-white flex flex-col items-center justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-4xl md:text-5xl font-serif text-oxxy-black tracking-widest">
                            OXXY
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isLoading ? 1 : 0 }}
                        transition={{ duration: isLoading ? 1.5 : 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="mt-8 h-[1px] bg-oxxy-black/20 w-32 origin-left"
                        style={{ transformOrigin: 'left' }}
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-4 text-[10px] text-oxxy-muted tracking-[0.3em] uppercase"
                    >
                        Complete Women Store
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loader;