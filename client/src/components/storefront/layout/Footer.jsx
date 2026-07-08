import { memo } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { InstagramIcon } from '../../../utils/icons';
import useWhatsAppNumber from '../../../hooks/useWhatsAppNumber';

const Footer = memo(() => {
    const { url: whatsappUrl } = useWhatsAppNumber();
    return (
        <footer aria-label="Site footer" className="bg-oxxy-black text-oxxy-white">
            <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    <div>
                        <Link to="/" className="text-2xl font-bold tracking-widest font-serif">
                            OXXY
                        </Link>
                        <p className="mt-4 text-sm text-oxxy-muted leading-relaxed max-w-xs">
                            Complete Women Store. Premium fashion for the modern woman.
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 border border-oxxy-overlay hover:bg-oxxy-overlay transition-colors"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="h-4 w-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 border border-oxxy-overlay hover:bg-oxxy-overlay transition-colors"
                                aria-label="Instagram"
                            >
                                <InstagramIcon className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold tracking-widest uppercase text-oxxy-muted mb-6">Navigation</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Home', path: '/' },
                                { label: 'Collections', path: '/collections' },
                                { label: 'New Arrivals', path: '/new-arrivals' },
                                { label: 'About Us', path: '/about' },
                                { label: 'Contact', path: '/contact' },
                            ].map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="text-sm text-oxxy-muted hover:text-oxxy-white transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold tracking-widest uppercase text-oxxy-muted mb-6">Collections</h4>
                        <p className="text-sm text-oxxy-muted">Discover our latest collections curated for you.</p>
                        <Link
                            to="/collections"
                            className="inline-block mt-4 text-sm font-medium text-oxxy-white underline underline-offset-4 hover:no-underline transition-all"
                        >
                            View All
                        </Link>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold tracking-widest uppercase text-oxxy-muted mb-6">Contact</h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-oxxy-muted hover:text-oxxy-white transition-colors"
                                >
                                    <MessageCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                    WhatsApp
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:hello@oxxy.in"
                                    className="flex items-center gap-2 text-sm text-oxxy-muted hover:text-oxxy-white transition-colors"
                                >
                                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                                    hello@oxxy.in
                                </a>
                            </li>
                            <li>
                                <span className="flex items-center gap-2 text-sm text-oxxy-muted">
                                    <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                                    +91 00000 00000
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-oxxy-overlay mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-oxxy-muted">
                        &copy; {new Date().getFullYear()} OXXY. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-xs text-oxxy-muted hover:text-oxxy-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/contact" className="text-xs text-oxxy-muted hover:text-oxxy-white transition-colors">
                            Contact
                        </Link>
                        <Link to="/admin/login" className="text-xs text-oxxy-muted/50 hover:text-oxxy-white transition-colors">
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
});

export default Footer;