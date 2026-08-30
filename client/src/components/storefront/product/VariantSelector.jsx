import { useMemo } from 'react';

const VariantSelector = ({ variants = [], selectedSize, selectedColor, onSizeChange, onColorChange }) => {
    const { sizes, colors } = useMemo(() => {
        const active = variants.filter((v) => v.isActive);
        const uniqueSizes = [...new Set(active.map((v) => v.size).filter(Boolean))];
        const uniqueColors = [...new Set(active.map((v) => v.color).filter(Boolean))];
        return { sizes: uniqueSizes, colors: uniqueColors };
    }, [variants]);

    const colorMap = useMemo(() => {
        const map = {};
        variants.forEach((v) => {
            if (v.color && v.colorCode) {
                map[v.color.trim().toLowerCase()] = v.colorCode;
            }
        });
        return map;
    }, [variants]);

    const availableColorsForSize = useMemo(() => {
        if (!selectedSize) return colors;
        return variants
            .filter((v) => v.isActive && v.size === selectedSize && v.stock > 0)
            .map((v) => v.color)
            .filter((v, i, a) => a.indexOf(v) === i);
    }, [variants, selectedSize, colors]);

    const availableSizesForColor = useMemo(() => {
        if (!selectedColor) return sizes;
        return variants
            .filter((v) => v.isActive && v.color === selectedColor && v.stock > 0)
            .map((v) => v.size)
            .filter((v, i, a) => a.indexOf(v) === i);
    }, [variants, selectedColor, sizes]);

    return (
        <div className="space-y-6">
            {colors.length > 0 && (
                <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-oxxy-muted mb-3">
                        Color {selectedColor && <span className="text-oxxy-black ml-1">— {selectedColor}</span>}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => {
                            const disabled = selectedSize && !availableColorsForSize.includes(color);
                            const code = colorMap[color.trim().toLowerCase()];
                            return (
                                <button
                                    key={color}
                                    disabled={disabled}
                                    onClick={() => onColorChange(selectedColor === color ? null : color)}
                                    className={`flex items-center gap-2.5 px-4 py-2.5 border transition-all ${
                                        selectedColor === color
                                            ? 'bg-oxxy-black text-oxxy-white border-oxxy-black'
                                            : disabled
                                                ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                                : 'bg-transparent text-oxxy-black border-oxxy-black/20 hover:border-oxxy-black'
                                    }`}
                                >
                                    {code && (
                                        <span
                                            className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                                                selectedColor === color ? 'border-white/50' : 'border-gray-200'
                                            }`}
                                            style={{ backgroundColor: code }}
                                        />
                                    )}
                                    <span className="text-sm font-medium">{color}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {sizes.length > 0 && (
                <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-oxxy-muted mb-3">
                        Size {selectedSize && <span className="text-oxxy-black ml-1">— {selectedSize}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            const disabled = selectedColor && !availableSizesForColor.includes(size);
                            return (
                                <button
                                    key={size}
                                    disabled={disabled}
                                    onClick={() => onSizeChange(selectedSize === size ? null : size)}
                                    className={`px-4 py-2.5 text-sm font-medium border transition-all ${
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
