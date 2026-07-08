import { usePublicSettings } from './useStorefrontData';

const useWhatsAppNumber = () => {
    const { data: settings } = usePublicSettings();
    const raw = settings?.whatsappNumber || '';
    const cleaned = raw.replace(/[^0-9]/g, '');
    const url = cleaned ? `https://wa.me/${cleaned}` : 'https://wa.me/';
    return { number: cleaned, url };
};

export default useWhatsAppNumber;
