const BASE_URL = 'https://oxxy.in';

export const injectJsonLd = (data) => {
    let script = document.querySelector('#jsonld');
    if (!script) {
        script = document.createElement('script');
        script.id = 'jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
};

export const getOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OXXY',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Complete Women Store — Premium women\'s fashion and clothing.',
    sameAs: [],
});

export const getWebsiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OXXY',
    url: BASE_URL,
    potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
});

export const getBreadcrumbSchema = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: `${BASE_URL}${item.path}`,
    })),
});

export const getProductSchema = (product) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: product.images?.[0]?.url,
    sku: product.sku || product._id,
    offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'INR',
        availability: product.variants?.some((v) => v.isActive && v.stock > 0)
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        url: `${BASE_URL}/product/${product.slug}`,
    },
});

export const getCollectionSchema = (collection) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description || collection.name,
    image: collection.coverImage?.url,
    url: `${BASE_URL}/collections/${collection.slug}`,
});
