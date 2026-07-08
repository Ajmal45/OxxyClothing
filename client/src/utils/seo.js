const BASE_URL = 'https://oxxy.in';

export const updateSEO = ({ title, description, image, url, type = 'website' }) => {
    const siteTitle = title ? `${title} | OXXY` : 'OXXY — Complete Women Store';
    document.title = title ? `${title} | OXXY` : 'OXXY — Complete Women Store';

    const setMeta = (name, content) => {
        if (!content) return;
        let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(name.includes('og:') ? 'property' : 'name', name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };

    const link = document.querySelector('link[rel="canonical"]');
    if (link) link.setAttribute('href', url || BASE_URL);

    setMeta('description', description);
    setMeta('og:title', siteTitle);
    setMeta('og:description', description);
    setMeta('og:url', url || BASE_URL);
    setMeta('og:type', type);
    if (image) setMeta('og:image', image);
};
