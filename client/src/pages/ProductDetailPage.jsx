import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Check, AlertTriangle } from 'lucide-react';
import { storefrontService } from '../services/storefrontService';
import { useProduct } from '../hooks/useStorefrontData';
import { injectJsonLd, getProductSchema, getBreadcrumbSchema } from '../utils/jsonld';
import ProductImageGallery from '../components/storefront/product/ProductImageGallery';
import VariantSelector from '../components/storefront/product/VariantSelector';
import RelatedProducts from '../components/storefront/product/RelatedProducts';
import RecentlyViewed, { addRecentlyViewed } from '../components/storefront/product/RecentlyViewed';
import { getWhatsAppUrl, sendWhatsAppEvent } from '../utils/whatsapp';
import { Spinner } from '../components/ui';
import { updateSEO } from '../utils/seo';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const { data: product, loading, error } = useProduct(slug);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        if (product) {
            addRecentlyViewed(product);
            storefrontService.recordEvent({
                eventType: 'product_view',
                productId: product._id,
                source: document.referrer ? 'referral' : 'direct',
                referrer: document.referrer || undefined,
            }).catch(() => {});

            updateSEO({
                title: product.seoTitle || product.name,
                description: product.seoDescription || product.description?.slice(0, 160),
                image: product.images?.[0]?.url,
                url: `/product/${product.slug}`,
                type: 'product',
            });

            injectJsonLd(getProductSchema(product));
        }
    }, [product]);

    const matchedVariant = useMemo(() => {
        if (!selectedSize || !selectedColor || !product?.variants) return null;
        return product.variants.find(
            (v) => v.size === selectedSize && v.color === selectedColor
        ) || null;
    }, [product, selectedSize, selectedColor]);

    const hasStock = matchedVariant ? matchedVariant.isActive && matchedVariant.stock > 0 : null;
    const totalStock = product?.variants?.reduce((sum, v) => sum + (v.isActive ? v.stock : 0), 0) || 0;

    const stockLabel = totalStock === 0 ? 'Out of Stock' :
        totalStock <= 5 ? 'Only Few Left' : 'Available';

    const stockClass = totalStock === 0 ? 'text-red-500' :
        totalStock <= 5 ? 'text-amber-600' : 'text-green-600';

    const handleWhatsApp = async () => {
        if (!product) return;
        sendWhatsAppEvent({
            productId: product._id,
            size: selectedSize,
            color: selectedColor,
            source: 'product_detail',
        });
        const url = await getWhatsAppUrl({ product, size: selectedSize, color: selectedColor });
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="pt-28 pb-20 flex items-center justify-center min-h-[60vh]">
                <Spinner className="h-8 w-8 text-black" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="pt-28 pb-20 px-5 max-w-7xl mx-auto text-center">
                <p className="text-lg text-oxxy-muted mb-4">{error || 'Product not found'}</p>
                <Link to="/collections" className="text-sm font-medium underline underline-offset-4">
                    Browse Collections
                </Link>
            </div>
        );
    }

    const canEnquire = !selectedSize || !selectedColor || (hasStock === true);
    const needsSelection = !selectedSize || !selectedColor;

    return (
        <div className="pt-24 lg:pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-5 lg:px-8">
                <Link
                    to="/collections"
                    className="inline-flex items-center gap-2 text-sm text-oxxy-muted hover:text-oxxy-black transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    <ProductImageGallery images={product.images} productName={product.name} />

                    <div className="flex flex-col">
                        <p className="text-xs text-oxxy-muted tracking-wider uppercase mb-2">
                            {product.productCode}
                        </p>
                        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-serif leading-tight mb-4">
                            {product.name}
                        </h1>
                        <p className="text-2xl font-semibold mb-6">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                        </p>

                        <div className="flex items-center gap-3 mb-6">
                            <span className={`text-sm font-medium ${stockClass}`}>
                                <Check className="h-3.5 w-3.5 inline mr-1" />
                                {stockLabel}
                            </span>
                        </div>

                        {product.description && (
                            <p className="text-sm leading-relaxed text-oxxy-gray/80 mb-8">
                                {product.description}
                            </p>
                        )}

                        <VariantSelector
                            variants={product.variants}
                            selectedSize={selectedSize}
                            selectedColor={selectedColor}
                            onSizeChange={setSelectedSize}
                            onColorChange={setSelectedColor}
                        />

                        {matchedVariant && !hasStock && (
                            <div className="flex items-center gap-2 mt-4 text-sm text-red-500">
                                <AlertTriangle className="h-4 w-4" />
                                This combination is currently unavailable.
                            </div>
                        )}

                        {product.category && (
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <span className="text-xs text-oxxy-muted uppercase tracking-wider">Category: </span>
                                <span className="text-sm font-medium">{product.category.name || product.category}</span>
                            </div>
                        )}

                        {product.collections?.length > 0 && (
                            <div className="mt-3">
                                <span className="text-xs text-oxxy-muted uppercase tracking-wider">Collections: </span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {product.collections.map((col) => (
                                        <Link
                                            key={col._id || col}
                                            to={`/collections/${col.slug || col}`}
                                            className="text-sm font-medium underline underline-offset-2 hover:no-underline"
                                        >
                                            {col.name || col}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-auto pt-8">
                            <button
                                onClick={handleWhatsApp}
                                disabled={needsSelection}
                                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-oxxy-black text-oxxy-white text-sm font-semibold tracking-wider uppercase hover:bg-oxxy-gray transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <MessageCircle className="h-5 w-5" />
                                {needsSelection ? 'Select Size & Color to Enquire' : 'Enquire on WhatsApp'}
                            </button>
                            {needsSelection && (
                                <p className="text-xs text-oxxy-muted mt-2 text-center">
                                    Please select size and color to enquire
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <RelatedProducts
                    category={product.category?._id || product.category}
                    excludeId={product._id}
                />
                <RecentlyViewed />
            </div>
        </div>
    );
};

export default ProductDetailPage;