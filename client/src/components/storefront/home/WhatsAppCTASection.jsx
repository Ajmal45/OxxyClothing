import { MessageCircle, ArrowRight } from 'lucide-react';
import useWhatsAppNumber from '../../../hooks/useWhatsAppNumber';

const WhatsAppCTASection = ({ data }) => {
    const { url: whatsappUrl } = useWhatsAppNumber();
    return (
        <section className="py-20 lg:py-32 px-5">
            <div className="max-w-4xl mx-auto text-center">
                <MessageCircle className="h-10 w-10 text-oxxy-black mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif leading-tight mb-6">
                    {data?.whatsappCTAHeading || 'Have Questions?'}
                </h2>
                <p className="text-base md:text-lg text-oxxy-gray/70 max-w-xl mx-auto mb-10">
                    {data?.whatsappCTAText || 'We are here to help. Reach out to us on WhatsApp for personalised assistance.'}
                </p>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-oxxy-black text-oxxy-white text-sm font-semibold tracking-wider uppercase hover:bg-oxxy-gray transition-colors"
                >
                    <MessageCircle className="h-5 w-5" />
                    Enquire on WhatsApp
                    <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </section>
    );
};

export default WhatsAppCTASection;