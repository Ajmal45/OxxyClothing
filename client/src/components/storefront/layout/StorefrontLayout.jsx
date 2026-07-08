import { useRef, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import Loader from '../ui/Loader';

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

const StorefrontLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [appLoading, setAppLoading] = useState(true);
    const prevPath = useRef(location.pathname);

    useEffect(() => {
        if (prevPath.current !== location.pathname) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            prevPath.current = location.pathname;
        }
    }, [location.pathname]);

    useEffect(() => {
        const timer = setTimeout(() => setAppLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Loader isLoading={appLoading} />
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-oxxy-black focus:text-oxxy-white focus:text-sm focus:font-semibold focus:outline-none"
            >
                Skip to main content
            </a>
            <div className="min-h-screen bg-oxxy-white text-oxxy-black">
                <Navbar isHome={isHome} />
                <main id="main-content">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
                <Footer />
                <BottomNav />
            </div>
        </>
    );
};

export default StorefrontLayout;