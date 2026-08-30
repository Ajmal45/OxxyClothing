import { useMemo } from 'react';

const VariantSelector = ({ variants = [], selectedSize, selectedColor, onSizeChange, onColorChange, productPrice = 0 }) => {
    const { sizes, colorData } = useMemo(() => {
        const active = variants.filter((v) => v.isActive);
        const uniqueSizes = [...new Set(active.map((v) => v.size).filter(Boolean))];

        // Group variants by color, pick first variant per color for thumbnail/price
        const colorMap = {};
        active.forEach((v) => {
            const key = v.color?.trim().toLowerCase();
            if (key && !colorMap[key]) {
                const allForColor = active.filter(
                    (av) => av.color?.trim().toLowerCase() === key
                );
                const totalStock = allForColor.reduce((s, av) => s + av.stock, 0);
                // Pick thumbnail: thumbnailImage > first image from images[] > null
                const thumb = v.thumbnailImage?.url || v.images?.[0]?.url || null;
                // Pick price: first variant price with value, or null (use product price)
                const priceVariant = allForColor.find((av) => av.price != null && av.price !== '');
                colorMap[key] = {
                    name: v.color,
                    code: v.colorCode || null,
                    thumbnail: thumb,
                    price: priceVariant ? priceVariant.price : null,
                    totalStock,
                };
            }
        });

        return { sizes: uniqueSizes, colorData: colorMap };
    }, [variants]);

    const colorKeys = Object.keys(colorData);

    const availableColorsForSize = useMemo(() => {
        if (!selectedSize) return colorKeys;
        return variants
            .filter((v) => v.isActive && v.size === selectedSize && v.stock > 0)
            .map((v) => v.color?.trim().toLowerCase())
            .filter((v, i, a) => a.indexOf(v) === i);
    }, [variants, selectedSize, colorKeys]);

    const availableSizesForColor = useMemo(() => {
        if (!selectedColor) return sizes;
        return variants
            .filter((v) => v.isActive && v.color?.trim().toLowerCase() === selectedColor.trim().toLowerCase() && v.stock > 0)
            .map((v) => v.size)
            .filter((v, i, a) => a.indexOf(v) === i);
    }, [variants, selectedColor, sizes]);

    return (
        <div className="space-y-6">
            {colorKeys.length > 0 && (
                <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-oxxy-muted mb-3">
                        Colour: {selectedColor && <span className="text-oxxy-black ml-1">{selectedColor}</span>}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {colorKeys.map((key) => {
                            const data = colorData[key];
                            const disabled = selectedSize && !availableColorsForSize.includes(key);
                            const isSelected = selectedColor?.trim().toLowerCase() === key;
                            const displayPrice = data.price || productPrice;

                            return (
                                <button
                                    key={key}
                                    disabled={disabled}
                                    onClick={() => onColorChange(isSelected ? null : data.name)}
                                    className={`flex flex-col items-center border-2 transition-all w-[90px] ${
                                        isSelected
                                            ? 'border-oxxy-black'
                                            : disabled
                                                ? 'border-gray-100 opacity-40 cursor-not-allowed'
                                                : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                >
                                    {/* Thumbnail Image */}
                                    <div className="w-full aspect-[3/4] bg-gray-50 overflow-hidden">
                                        {data.thumbnail ? (
                                            <img
                                                src={data.thumbnail}
                                                alt={data.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium"
                                                style={{ backgroundColor: data.code || '#e5e7eb' }}
                                            >
                                                {data.code ? '' : data.name}
                                            </div>
                                        )}
                                    </div>
                                    {/* Price */}
                                    <div className="w-full px-1.5 py-2 text-center">
                                        <p className="text-xs font-semibold text-oxxy-black">
                                            ₹{Number(displayPrice).toLocaleString('en-IN')}
                                        </p>
                                        {data.price && data.price !== productPrice && productPrice > 0 && (
                                            <p className="text-[10px] text-oxxy-muted line-through">
                                                ₹{Number(productPrice).toLocaleString('en-IN')}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {sizes.length > 0 && (
                <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-oxxy-muted mb-3">
                        Size: {selectedSize && <span className="text-oxxy-black ml-1">{selectedSize}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            const disabled = selectedColor && !availableSizesForColor.includes(size);
                            return (
                                <button
                                    key={size}
                                    disabled={disabled}
                                    onClick={() => onSizeChange(selectedSize === size ? null : size)}
                                    className={`px-5 py-2.5 text-sm font-medium border transition-all ${
                                        selectedSize === size
                                            ? 'bg-oxxy-black text-oxxy-white border-oxxy-black'
                                            : disabled
                                                ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                                                : 'bg-transparent text-oxxy-black border-oxxy-black/20 hover:border-oxxy-black'
                                    }`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantSelector;
