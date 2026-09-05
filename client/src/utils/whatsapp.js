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
    // Always link the exact product page — never the listing page the
    // customer happened to tap "enquire" from (card, collection, home).
    const productUrl = product?.slug
        ? `${window.location.origin}/product/${product.slug}`
        : window.location.href;

    const parts = ['Hi OXXY,', '', "I'm interested in this product.", ''];

    if (product) {
        parts.push(`Product: ${product.name}`);
        if (product.productCode) parts.push(`Product Code: ${product.productCode}`);
    }

    if (size) parts.push(`Selected Size: ${size}`);
    if (color) parts.push(`Selected Color: ${color}`);

    parts.push('');
    parts.push(`Product Link: ${productUrl}`);
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
        // Blob with JSON type so express.json() parses it (plain strings
        // arrive as text/plain and get rejected by validation).
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        if (navigator.sendBeacon) {
            const queued = navigator.sendBeacon('/api/analytics/events', blob);
            if (queued) return;
        }
        // Fallback: fire-and-forget POST
        fetch('/api/analytics/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
        }).catch(() => {});
    } catch {
        // non-blocking
    }
};
