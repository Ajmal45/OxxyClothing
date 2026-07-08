import { storefrontService } from '../services/storefrontService';

let cachedNumber = null;

const getWhatsAppNumber = async () => {
    if (cachedNumber) return cachedNumber;
    try {
        const res = await storefrontService.getPublicSettings();
        const data = res.data.data || res.data;
        cachedNumber = data?.whatsappNumber || '918080808080';
        return cachedNumber;
    } catch {
        return '918080808080';
    }
};

export const getWhatsAppUrl = async ({ product, size, color }) => {
    const number = await getWhatsAppNumber();
    const currentUrl = window.location.href;

    const parts = ['Hi OXXY,', '', "I'm interested in this product.", ''];

    if (product) {
        parts.push(`Product: ${product.name}`);
        if (product.productCode) parts.push(`Product Code: ${product.productCode}`);
    }

    if (size) parts.push(`Selected Size: ${size}`);
    if (color) parts.push(`Selected Color: ${color}`);

    parts.push('');
    parts.push(`Product Link: ${currentUrl}`);
    parts.push('');
    parts.push('Is this product currently available?');

    const text = encodeURIComponent(parts.join('\n'));
    return `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${text}`;
};

export const sendWhatsAppEvent = ({ productId, collectionId, size, color, source = 'whatsapp_button' }) => {
    const payload = {
        eventType: 'whatsapp_click',
        selectedSize: size || undefined,
        selectedColor: color || undefined,
        source,
    };
    if (productId) payload.productId = productId;
    if (collectionId) payload.collectionId = collectionId;

    try {
        const baseUrl = import.meta.env.VITE_API_URL || '/api';
        navigator.sendBeacon?.(`${baseUrl}/analytics/events`, JSON.stringify(payload));
    } catch {
        // non-blocking
    }
};
