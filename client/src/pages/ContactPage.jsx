import { useEffect } from 'react';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { usePublicSettings } from '../hooks/useStorefrontData';
import { InstagramIcon } from '../utils/icons';
import { updateSEO } from '../utils/seo';

const ContactPage = () => {
    const { data: settings } = usePublicSettings();

    useEffect(() => {
        updateSEO({ title: 'Contact Us', description: 'Get in touch with OXXY via WhatsApp, email, or phone.' });
    }, []);

    return (
        <div className="pt-24 lg:pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-5 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-oxxy-muted mb-4">Contact</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-base text-oxxy-gray/70">
                        We would love to hear from you. Reach out through any of the channels below.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <a
                        href={`https://wa.me/${(settings?.whatsappNumber || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-8 border border-gray-200 hover:border-oxxy-black transition-colors text-center"
                    >
                        <MessageCircle className="h-8 w-8 mx-auto mb-4 text-oxxy-black" />
                        <h3 className="text-sm font-semibold tracking-wider uppercase mb-2">WhatsApp</h3>
                        <p className="text-sm text-oxxy-muted">
                            {settings?.whatsappNumber ? `+${settings.whatsappNumber}` : 'Chat with us'}
                        </p>
                    </a>

                    {settings?.storeEmail && (
                        <a
                            href={`mailto:${settings.storeEmail}`}
                            className="group p-8 border border-gray-200 hover:border-oxxy-black transition-colors text-center"
                        >
                            <Mail className="h-8 w-8 mx-auto mb-4 text-oxxy-black" />
                            <h3 className="text-sm font-semibold tracking-wider uppercase mb-2">Email</h3>
                            <p className="text-sm text-oxxy-muted">{settings.storeEmail}</p>
                        </a>
                    )}

                    {settings?.storePhone && (
                        <div className="p-8 border border-gray-200 text-center">
                            <Phone className="h-8 w-8 mx-auto mb-4 text-oxxy-black" />
                            <h3 className="text-sm font-semibold tracking-wider uppercase mb-2">Phone</h3>
                            <p className="text-sm text-oxxy-muted">{settings.storePhone}</p>
                        </div>
                    )}

                    {settings?.instagramUrl && (
                        <a
                            href={settings.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-8 border border-gray-200 hover:border-oxxy-black transition-colors text-center"
                        >
                            <InstagramIcon className="h-8 w-8 mx-auto mb-4 text-oxxy-black" />
                            <h3 className="text-sm font-semibold tracking-wider uppercase mb-2">Instagram</h3>
                            <p className="text-sm text-oxxy-muted">Follow us</p>
                        </a>
                    )}

                    {settings?.storeAddress && (
                        <div className="lg:col-span-2 p-8 border border-gray-200 text-center">
                            <MapPin className="h-8 w-8 mx-auto mb-4 text-oxxy-black" />
                            <h3 className="text-sm font-semibold tracking-wider uppercase mb-2">Address</h3>
                            <p className="text-sm text-oxxy-muted max-w-md mx-auto">{settings.storeAddress}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;