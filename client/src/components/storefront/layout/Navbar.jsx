import { useState, useEffect, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';

const MobileMenu = lazy(() => import('./MobileMenu'));

const NAV_ITEMS = [
    { label: 'Home', path: '/' },
    { label: 'Collection', path: '/collections' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
];

const Navbar = ({ isHome }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const showSolid = !isHome || scrolled;

    return (
        <>
            <nav
                aria-label="Main navigation"
                className={`fixed top-0 left-0 right-0 z-50 border-b border-oxxy-black/10 transition-all duration-500 ${
                    showSolid ? 'bg-oxxy-white/95 backdrop-blur-md' : 'bg-oxxy-white/80 backdrop-blur-sm'
                }`}
            >
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="flex items-center justify-between h-[72px] lg:h-20">
                        <Link to="/" className="flex items-center gap-2.5">
                            <span className="text-xl lg:text-2xl font-bold tracking-[0.25em] font-serif text-oxxy-black">OXXY</span>
                            <span className="hidden sm:block text-[9px] tracking-[0.15em] uppercase text-oxxy-muted">Complete Women's Store</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            {NAV_ITEMS.map((item) => (
                                <Link key={item.path} to={item.path} className={`relative text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${location.pathname === item.path ? 'text-oxxy-black' : 'text-oxxy-muted hover:text-oxxy-black'}`}>
                                    {item.label}
                                    {location.pathname === item.path && <span className="absolute -bottom-1 left-0 right-0 h-px bg-oxxy-gold" />}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link to="/collections" className="p-2 text-oxxy-black/70 transition-colors hover:text-oxxy-black" aria-label="Search products"><Search className="h-5 w-5" strokeWidth={1.5} /></Link>
                            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-oxxy-black" aria-label="Open menu"><Menu className="h-6 w-6" /></button>
                        </div>
                    </div>
                </div>
            </nav>

            {mobileOpen && (
                <Suspense fallback={null}>
                    <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
                </Suspense>
            )}
        </>
    );
};

export default Navbar;