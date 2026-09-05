import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl, sendWhatsAppEvent } from '../../../utils/whatsapp';
import { optimizeImageUrl } from '../../../utils/image';

const ProductCard = memo(({ product }) => {
    const [imgError, setImgError] = useState(false);
    const [hovered, setHovered] = useState(false);
    const primaryImage = product?.images?.[0]?.url ? optimizeImageUrl(product.images[0].url, 600) : null;
    const hoverImage = product?.images?.[1]?.url ? optimizeImageUrl(product.images[1].url, 600) : null;
    const hasStock = product?.variants?.some((v) => v.isActive && v.stock > 0);
    const availableSizes = product?.variants
        ?.filter((v) => v.isActive && v.stock > 0)
        .map((v) => v.size)
        .filter((v, i, a) => a.indexOf(v) === i);

    const handleWhatsApp = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        sendWhatsAppEvent({ productId: product._id, source: 'product_card' });
        const url = await getWhatsAppUrl({ product });
        window.open(url, '_blank');
    };

    return (
        <Link
            to={`/product/${product.slug}`}
            className="group block"
            onMouseEnter={() => setHovered(true)}
        >
            <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                {primaryImage && !imgError ? (
                    <>
                        <img
                            src={primaryImage}
                            alt={product.images?.[0]?.altText || product.name}
                            width="600"
                            height="800"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="w-full h-full object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            onError={() => setImgError(true)}
                        />
                        {hovered && hoverImage && (
                            <img
                                src={hoverImage}
                                alt=""
                                aria-hidden="true"
                                width="600"
                                height="800"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                            />
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-xs text-oxxy-muted uppercase tracking-wider">No Image</span>
                    </div>
                )}

                {product.isNewArrival && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-oxxy-black text-oxxy-white text-[10px] font-semibold tracking-wider uppercase">
                        New
                    </span>
                )}

                {!hasStock && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="px-4 py-1.5 bg-oxxy-black text-oxxy-white text-xs font-medium tracking-wider uppercase">
                            Out of Stock
                        </span>
                    </div>
                )}

                <button
                    onClick={handleWhatsApp}
                    className="absolute bottom-3 right-3 w-10 h-10 bg-oxxy-black text-oxxy-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Enquire on WhatsApp"
                >
                    <MessageCircle className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-4 space-y-1.5 px-0.5">
                <h3 className="text-sm font-medium text-oxxy-black truncate">
                    {product.name}
                </h3>
                <p className="text-sm font-semibold text-oxxy-black">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                </p>
                {availableSizes?.length > 0 && (
                    <p className="text-xs text-oxxy-muted">
                        Sizes: {availableSizes.join(', ')}
                    </p>
                )}
            </div>
        </Link>
    );
});

export default ProductCard;
