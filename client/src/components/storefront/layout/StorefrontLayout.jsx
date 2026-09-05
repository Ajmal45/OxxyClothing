import { useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

const StorefrontLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const prevPath = useRef(location.pathname);

    useEffect(() => {
        if (prevPath.current !== location.pathname) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            prevPath.current = location.pathname;
        }
    }, [location.pathname]);

    return (
        <>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-oxxy-black focus:text-oxxy-white focus:text-sm focus:font-semibold focus:outline-none"
            >
                Skip to main content
            </a>
            <div className="min-h-screen bg-oxxy-white text-oxxy-black">
                <Navbar isHome={isHome} />
                <main id="main-content">
                    <div key={location.pathname} className="route-fade">
                        <Outlet />
                    </div>
                </main>
                <Footer />
                <BottomNav />
            </div>
        </>
    );
};

export default StorefrontLayout;
