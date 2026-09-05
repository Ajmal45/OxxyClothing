// Central image-URL optimizer: serve resized, auto-format images from CDNs
// instead of full-resolution originals. Unknown hosts pass through untouched.

export const optimizeImageUrl = (url, width = 800) => {
    if (!url || typeof url !== 'string') return url;

    // Cloudinary: inject f_auto,q_auto,w_<width> delivery transform
    if (url.includes('res.cloudinary.com')) {
        if (url.includes('/upload/f_auto')) return url;
        return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    }

    // Pexels: clamp width param
    if (url.includes('images.pexels.com')) {
        try {
            const u = new URL(url);
            u.searchParams.set('auto', 'compress');
            u.searchParams.set('cs', 'tinysrgb');
            u.searchParams.set('w', String(width));
            return u.toString();
        } catch {
            return url;
        }
    }

    return url;
};
