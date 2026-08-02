import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, User, ShoppingBag } from 'lucide-react';
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
    const [accountOpen, setAccountOpen] = useState(false);
    const [bagOpen, setBagOpen] = useState(false);
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
    const closePanels = () => { setAccountOpen(false); setBagOpen(false); };

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
                            <button onClick={() => setAccountOpen(true)} className="p-2 text-oxxy-black/70 transition-colors hover:text-oxxy-black" aria-label="Account"><User className="h-5 w-5" strokeWidth={1.5} /></button>
                            <button onClick={() => setBagOpen(true)} className="p-2 text-oxxy-black/70 transition-colors hover:text-oxxy-black" aria-label="Shopping bag"><ShoppingBag className="h-5 w-5" strokeWidth={1.5} /></button>
                            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-oxxy-black" aria-label="Open menu"><Menu className="h-6 w-6" /></button>
                        </div>
                    </div>
                </div>
            </nav>

            <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
            {(accountOpen || bagOpen) && (
                <div className="fixed inset-0 z-[70] grid place-items-center bg-oxxy-black/35 p-5" onClick={closePanels}>
                    <section className="w-full max-w-md bg-oxxy-white p-8 shadow-2xl" role="dialog" aria-modal="true" aria-label={accountOpen ? 'Your account' : 'Shopping bag'} onClick={(event) => event.stopPropagation()}>
                        <button className="float-right text-xs font-semibold tracking-widest text-oxxy-muted uppercase hover:text-oxxy-black" onClick={closePanels}>Close</button>
                        {accountOpen ? <>
                            <p className="text-[10px] font-semibold tracking-[0.24em] text-oxxy-gold uppercase">OXXY account</p>
                            <h2 className="mt-3 font-serif text-3xl">A more personal edit is coming.</h2>
                            <p className="mt-4 font-editorial text-xl leading-relaxed text-oxxy-gray">For styling advice, product availability, or an order update, our team is ready on WhatsApp.</p>
                            <Link to="/contact" onClick={closePanels} className="mt-7 inline-block bg-oxxy-black px-6 py-3 text-[10px] font-semibold tracking-[0.18em] text-oxxy-white uppercase">Contact us</Link>
                        </> : <>
                            <p className="text-[10px] font-semibold tracking-[0.24em] text-oxxy-gold uppercase">Your bag</p>
                            <h2 className="mt-3 font-serif text-3xl">Your bag is currently empty.</h2>
                            <p className="mt-4 font-editorial text-xl leading-relaxed text-oxxy-gray">OXXY takes each order personally. Browse a piece you love, then enquire directly for fit and availability.</p>
                            <Link to="/collections" onClick={closePanels} className="mt-7 inline-block bg-oxxy-black px-6 py-3 text-[10px] font-semibold tracking-[0.18em] text-oxxy-white uppercase">Browse collection</Link>
                        </>}
                    </section>
                </div>
            )}
        </>
    );
};

export default Navbar;