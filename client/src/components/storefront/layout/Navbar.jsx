import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import MobileMenu from './MobileMenu';
import useWhatsAppNumber from '../../../hooks/useWhatsAppNumber';

const NAV_ITEMS = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'About Us', path: '/about' },
];

const Navbar = ({ isHome }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { url: whatsappUrl } = useWhatsAppNumber();

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
                        <Link to="/" className="flex items-center gap-2">
                            <span className={`text-xl lg:text-2xl font-bold tracking-widest font-serif ${
                                showSolid ? 'text-oxxy-white' : 'text-oxxy-white'
                            }`}>
                                OXXY
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
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
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
                                    showSolid
                                        ? 'bg-oxxy-white text-oxxy-black hover:bg-oxxy-light'
                                        : 'bg-white text-oxxy-black hover:bg-oxxy-light'
                                }`}
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </a>
                        </div>

                        <button
                            onClick={() => setMobileOpen(true)}
                            className={`lg:hidden p-2 ${showSolid ? 'text-oxxy-white' : 'text-white'}`}
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </nav>

            <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
        </>
    );
};

export default Navbar;