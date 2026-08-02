import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';
import MobileMenu from './MobileMenu';

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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    showSolid
                        ? 'bg-oxxy-black/95 backdrop-blur-md border-b border-oxxy-overlay'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="flex items-center justify-between h-[72px] lg:h-20">
                        <Link to="/" className="flex items-center gap-2.5">
                            <span className={`text-xl lg:text-2xl font-bold tracking-[0.25em] font-serif ${
                                showSolid ? 'text-oxxy-white' : 'text-oxxy-white'
                            }`}>
                                OXXY
                            </span>
                            <span className={`hidden sm:block text-[9px] tracking-[0.15em] uppercase ${
                                showSolid ? 'text-oxxy-white/50' : 'text-white/50'
                            }`}>
                                Complete Women's Store
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${
                                        location.pathname === item.path
                                            ? 'text-oxxy-white'
                                            : showSolid
                                                ? 'text-oxxy-muted hover:text-oxxy-white'
                                                : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                    {location.pathname === item.path && (
                                        <span className="absolute -bottom-1 left-0 right-0 h-px bg-oxxy-white scale-x-100 transition-transform duration-300" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                className={`p-2 transition-colors ${showSolid ? 'text-oxxy-white/70 hover:text-oxxy-white' : 'text-white/70 hover:text-white'}`}
                                aria-label="Search"
                            >
                                <Search className="h-5 w-5" strokeWidth={1.5} />
                            </button>
                            <Link
                                to="/account"
                                className={`p-2 transition-colors ${showSolid ? 'text-oxxy-white/70 hover:text-oxxy-white' : 'text-white/70 hover:text-white'}`}
                                aria-label="Account"
                            >
                                <User className="h-5 w-5" strokeWidth={1.5} />
                            </Link>
                            <Link
                                to="/cart"
                                className={`p-2 transition-colors ${showSolid ? 'text-oxxy-white/70 hover:text-oxxy-white' : 'text-white/70 hover:text-white'}`}
                                aria-label="Cart"
                            >
                                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                            </Link>

                            <button
                                onClick={() => setMobileOpen(true)}
                                className={`lg:hidden p-2 ${showSolid ? 'text-oxxy-white' : 'text-white'}`}
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
        </>
    );
};

export default Navbar;
