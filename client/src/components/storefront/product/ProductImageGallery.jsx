import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImageGallery = ({ images = [], productName }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const prev = () => setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1));
    const next = () => setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0));

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
                <span className="text-sm text-oxxy-muted uppercase tracking-wider">No Image</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden group">
                <img
                    src={images[selectedIndex]?.url}
                    alt={images[selectedIndex]?.altText || `${productName} - Image ${selectedIndex + 1}`}
                    className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                i === selectedIndex ? 'bg-oxxy-black w-4' : 'bg-oxxy-black/30'
                            }`}
                            aria-label={`View image ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                        <button
                            key={img._id || i}
                            onClick={() => setSelectedIndex(i)}
                            className={`flex-shrink-0 w-16 h-20 border-2 transition-colors overflow-hidden ${
                                i === selectedIndex ? 'border-oxxy-black' : 'border-transparent'
                            }`}
                        >
                            <img
                                src={img.url}
                                alt={img.altText || `${productName} thumbnail ${i + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageGallery;