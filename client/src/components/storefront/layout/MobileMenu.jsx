import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useWhatsAppNumber from '../../../hooks/useWhatsAppNumber';

const NAV_ITEMS = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const MobileMenu = ({ open, onClose }) => {
    const location = useLocation();
    const menuRef = useRef(null);
    const { url: whatsappUrl } = useWhatsAppNumber();

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            const timer = setTimeout(() => {
                const el = menuRef.current?.querySelector('button');
                el?.focus();
            }, 100);
            return () => { clearTimeout(timer); document.body.style.overflow = ''; };
        }
        document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    useEffect(() => {
        onClose();
    }, [location.pathname]);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e) => {
            if (e.key !== 'Tab' || !menuRef.current) return;
            const focusable = menuRef.current.querySelectorAll(FOCUSABLE);
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[60] bg-oxxy-black"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Navigation menu"
                >
                    <div className="flex flex-col h-full p-8">
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="p-2 text-oxxy-white"
                                aria-label="Close menu"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <nav className="flex-1 flex flex-col justify-center items-center gap-8" aria-label="Mobile navigation">
                            {NAV_ITEMS.map((item, i) => (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.08 }}
                                >
                                    <Link
                                        to={item.path}
                                        onClick={onClose}
                                        className={`text-3xl lg:text-4xl font-serif tracking-wide transition-colors ${
                                            location.pathname === item.path
                                                ? 'text-oxxy-white'
                                                : 'text-oxxy-muted hover:text-oxxy-white'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8"
                            >
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-8 py-4 bg-oxxy-white text-oxxy-black text-base font-semibold tracking-wider uppercase"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Enquire on WhatsApp
                                </a>
                            </motion.div>
                        </nav>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
