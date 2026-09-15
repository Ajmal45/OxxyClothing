import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, X, MessageCircle, Home, Grid3X3, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Collections', path: '/collections', icon: Grid3X3 },
    { label: 'New Arrivals', path: '/new-arrivals', icon: Sparkles },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
];

const DESKTOP_NAV = [
    { label: 'Home', path: '/' },
    { label: 'Collection', path: '/collections' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
];

const Navbar = ({ isHome }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const menuRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

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
                            <img src="/oxxy-logo1.png" alt="OXXY" className="h-8 w-8 lg:h-10 lg:w-10 object-contain" />
                            <span className="hidden sm:block text-lg lg:text-2xl font-bold tracking-[0.2em] font-serif text-oxxy-black">OXXY</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            {DESKTOP_NAV.map((item) => (
                                <Link key={item.path} to={item.path} className={`relative text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${location.pathname === item.path ? 'text-oxxy-black' : 'text-oxxy-muted hover:text-oxxy-black'}`}>
                                    {item.label}
                                    {location.pathname === item.path && <span className="absolute -bottom-1 left-0 right-0 h-px bg-oxxy-gold" />}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link to="/collections" className="p-2 text-oxxy-black/70 transition-colors hover:text-oxxy-black" aria-label="Search products">
                                <Search className="h-5 w-5" strokeWidth={1.5} />
                            </Link>
                            <div
                                role="button"
                                tabIndex={0}
                                aria-label="Open menu"
                                className="lg:hidden p-2 text-oxxy-black cursor-pointer"
                                onClick={() => setMenuOpen(true)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMenuOpen(true); }}
                            >
                                <Menu className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div
                ref={menuRef}
                className={`fixed inset-0 z-[60] bg-oxxy-black transition-opacity duration-300 ${
                    menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                <div className="flex flex-col h-full p-8">
                    <div className="flex justify-end">
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label="Close menu"
                            className="p-2 text-oxxy-white cursor-pointer"
                            onClick={() => setMenuOpen(false)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMenuOpen(false); }}
                        >
                            <X className="h-6 w-6" />
                        </div>
                    </div>

                    <nav className="flex-1 flex flex-col justify-center items-center gap-8" aria-label="Mobile navigation">
                        {NAV_ITEMS.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.path}
                                    className={`transition-all duration-300 ${
                                        menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                                    }`}
                                    style={{ transitionDelay: menuOpen ? `${100 + i * 80}ms` : '0ms' }}
                                >
                                    <Link
                                        to={item.path}
                                        onClick={() => setMenuOpen(false)}
                                        className={`text-3xl lg:text-4xl font-serif tracking-wide transition-colors ${
                                            location.pathname === item.path
                                                ? 'text-oxxy-white'
                                                : 'text-oxxy-muted hover:text-oxxy-white'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                </div>
                            );
                        })}

                        <div
                            className={`mt-8 transition-all duration-300 ${
                                menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                            }`}
                            style={{ transitionDelay: menuOpen ? '500ms' : '0ms' }}
                        >
                            <a
                                href="https://wa.me/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-8 py-4 bg-oxxy-white text-oxxy-black text-base font-semibold tracking-wider uppercase"
                            >
                                <MessageCircle className="h-5 w-5" />
                                Enquire on WhatsApp
                            </a>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Navbar;
