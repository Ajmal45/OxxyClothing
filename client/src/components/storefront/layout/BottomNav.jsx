import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Sparkles, MessageCircle } from 'lucide-react';
import useWhatsAppNumber from '../../../hooks/useWhatsAppNumber';

const ITEMS = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Collections', path: '/collections', icon: Grid3X3 },
    { label: 'New Arrivals', path: '/new-arrivals', icon: Sparkles },
];

const BottomNav = memo(() => {
    const location = useLocation();
    const { url: whatsappUrl } = useWhatsAppNumber();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-oxxy-black border-t border-oxxy-overlay">
            <div className="flex items-center justify-around h-16">
                {ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                                isActive ? 'text-oxxy-white' : 'text-oxxy-muted'
                            }`}
                            aria-label={item.label}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-[10px] font-medium tracking-wider uppercase">{item.label}</span>
                        </Link>
                    );
                })}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-0.5 px-3 py-1 transition-colors text-oxxy-white"
                    aria-label="WhatsApp"
                >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-[10px] font-medium tracking-wider uppercase">WhatsApp</span>
                </a>
            </div>
        </nav>
    );
});

export default BottomNav;