import { useState, useCallback, useRef } from 'react';
import { Plus, Trash2, AlertCircle, ChevronDown, ChevronUp, UploadCloud, X, Loader, GripVertical } from 'lucide-react';
import { Button, Input, Toggle, Badge } from './ui';
import { imageService } from '../services/apiServices';
import { useToast } from './ui/Toast';

const EMPTY_COLOR = {
    color: '',
    colorCode: '#000000',
    size: '',
    images: [],
    price: '',
    stock: 1,
    sku: '',
    isActive: true,
};

const PRESET_COLORS = [
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Red', code: '#E53935' },
    { name: 'Blue', code: '#1E88E5' },
    { name: 'Green', code: '#43A047' },
    { name: 'Yellow', code: '#FDD835' },
    { name: 'Pink', code: '#EC407A' },
    { name: 'Purple', code: '#8E24AA' },
    { name: 'Orange', code: '#FB8C00' },
    { name: 'Navy', code: '#1A237E' },
    { name: 'Grey', code: '#9E9E9E' },
    { name: 'Brown', code: '#6D4C41' },
    { name: 'Beige', code: '#D7CCC8' },
    { name: 'Maroon', code: '#880E4F' },
    { name: 'Teal', code: '#00897B' },
    { name: 'Gold', code: '#C4A96A' },
];

const ColorSwatch = ({ code, selected, onClick, size = 'w-7 h-7' }) => (
    <button
        type="button"
        onClick={onClick}
        className={`${size} rounded-full border-2 transition-all flex-shrink-0 ${
            selected ? 'border-black ring-2 ring-black/20 scale-110' : 'border-gray-200 hover:border-gray-400'
        }`}
        style={{ backgroundColor: code || '#ccc' }}
        title={code}
    />
);

const VariantImageCard = ({ img, index, onRemove }) => (
    <div className="relative group flex-shrink-0">
        <img
            src={img.url}
            alt={img.altText || 'Color variant image'}
            className="h-20 w-20 object-cover rounded-lg bg-gray-100"
        />
        <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
        >
            <X className="h-3 w-3" />
        </button>
        {index === 0 && (
            <span className="absolute bottom-0.5 left-0.5 text-[9px] font-medium bg-black/70 text-white px-1 rounded">
                Cover
            </span>
        )}
    </div>
);

const ColorVariantCard = ({ variant, index, onChange, onRemove, onImageUpload, isUploading }) => {
    const [expanded, setExpanded] = useState(true);
    const fileInputRef = useRef(null);
    const { toast } = useToast();

    const update = (field, value) => {
        const updated = { ...variant, [field]: value };
        onChange(index, updated);
    };

    const handleImageFiles = async (files) => {
        const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
        if (validFiles.length === 0) return;
        onImageUpload(index, validFiles);
    };

    const removeImage = (imgIndex) => {
        const updated = variant.images.filter((_, i) => i !== imgIndex);
        update('images', updated);
    };

    const isWhite = variant.colorCode?.toUpperCase() === '#FFFFFF';

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Header */}
            <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <ColorSwatch code={variant.colorCode} selected={false} size="w-8 h-8" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {variant.color || 'New Color'}
                        {variant.size && <span className="text-gray-400 font-normal ml-1">/ {variant.size}</span>}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span>{variant.images?.length || 0} images</span>
                        <span>Stock: {variant.stock}</span>
                        {variant.sku && <span>SKU: {variant.sku}</span>}
                    </div>
                </div>
                {!variant.isActive && (
                    <Badge variant="warning" className="text-xs">Inactive</Badge>
                )}
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50"
                        aria-label="Remove color"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
                    {/* Color Name + Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Color Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={variant.color}
                                onChange={(e) => update('color', e.target.value)}
                                placeholder="e.g. Black, Navy Blue"
                                className="h-9 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Color Code</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={variant.colorCode || '#000000'}
                                    onChange={(e) => update('colorCode', e.target.value)}
                                    className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer flex-shrink-0"
                                />
                                <Input
                                    value={variant.colorCode || ''}
                                    onChange={(e) => update('colorCode', e.target.value)}
                                    placeholder="#000000"
                                    className="h-9 text-sm font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preset Color Swatches */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">Quick Pick</label>
                        <div className="flex flex-wrap gap-1.5">
                            {PRESET_COLORS.map((preset) => (
                                <ColorSwatch
                                    key={preset.code}
                                    code={preset.code}
                                    selected={variant.colorCode?.toUpperCase() === preset.code.toUpperCase()}
                                    onClick={() => {
                                        update('colorCode', preset.code);
                                        if (!variant.color) update('color', preset.name);
                                    }}
                                    size="w-6 h-6"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size + Stock + SKU + Price */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Size (optional)</label>
                            <Input
                                value={variant.size || ''}
                                onChange={(e) => update('size', e.target.value)}
                                placeholder="S, M, L, XL"
                                className="h-9 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Stock <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={variant.stock}
                                onChange={(e) => update('stock', Number(e.target.value))}
                                className="h-9 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">SKU</label>
                            <Input
                                value={variant.sku || ''}
                                onChange={(e) => update('sku', e.target.value)}
                                placeholder="SHIRT-BLK"
                                className="h-9 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Price Override (optional)</label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={variant.price || ''}
                                onChange={(e) => update('price', e.target.value ? Number(e.target.value) : '')}
                                placeholder="Use product price"
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-2">
                        <Toggle
                            id={`variant-active-${index}`}
                            checked={variant.isActive}
                            onChange={(val) => update('isActive', val)}
                        />
                        <span className="text-xs text-gray-500">{variant.isActive ? 'Active' : 'Inactive'}</span>
                    </div>

                    {/* Images for this color */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                            Color Images {variant.images?.length > 0 && `(${variant.images.length})`}
                        </label>
                        <div
                            onDrop={(e) => { e.preventDefault(); handleImageFiles(e.dataTransfer.files); }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                            className="border border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => handleImageFiles(e.target.files)}
                            />
                            {isUploading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin text-gray-400" />
                                    <span className="text-xs text-gray-500">Uploading...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <UploadCloud className="h-4 w-4 text-gray-300" />
                                    <span className="text-xs text-gray-500">Click or drop images for this color</span>
                                </div>
                            )}
                        </div>

                        {variant.images?.length > 0 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                {variant.images.map((img, i) => (
                                    <VariantImageCard
                                        key={img.publicId || i}
                                        img={img}
                                        index={i}
                                        onRemove={removeImage}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const VariantEditor = ({ variants, onChange, productPrice = 0 }) => {
    const { toast } = useToast();
    const [newColor, setNewColor] = useState(EMPTY_COLOR);
    const [addError, setAddError] = useState('');
    const [uploadingIndex, setUploadingIndex] = useState(null);

    const availableCount = variants.filter((v) => v.isActive && v.stock > 0).length;
    const outOfStockCount = variants.filter((v) => v.isActive && v.stock === 0).length;
    const uniqueColors = [...new Set(variants.map((v) => v.color?.trim().toLowerCase()).filter(Boolean))].length;

    const hasDuplicateColor = (color, size, excludeIndex = -1) =>
        variants.some(
            (v, i) =>
                i !== excludeIndex &&
                v.color.trim().toLowerCase() === color.trim().toLowerCase() &&
                (v.size || '').trim().toLowerCase() === (size || '').trim().toLowerCase()
        );

    const handleAdd = () => {
        setAddError('');
        if (!newColor.color.trim()) {
            setAddError('Color name is required.');
            return;
        }
        if (hasDuplicateColor(newColor.color, newColor.size)) {
            setAddError(`Color "${newColor.color.trim()}"${newColor.size ? ` / ${newColor.size.trim()}` : ''} already exists.`);
            return;
        }
        if (Number(newColor.stock) < 0) {
            setAddError('Stock must be 0 or more.');
            return;
        }
        const toAdd = {
            ...newColor,
            stock: Number(newColor.stock),
            price: newColor.price ? Number(newColor.price) : '',
        };
        onChange([...variants, toAdd]);
        setNewColor(EMPTY_COLOR);
    };

    const handleRemove = (index) => {
        onChange(variants.filter((_, i) => i !== index));
    };

    const handleChange = (index, updatedVariant) => {
        const updated = variants.map((v, i) => (i === index ? updatedVariant : v));
        onChange(updated);
    };

    const handleImageUpload = async (variantIndex, files) => {
        setUploadingIndex(variantIndex);
        try {
            const results = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append('image', file);
                    const res = await imageService.upload(formData);
                    return {
                        url: res.data.data.url,
                        publicId: res.data.data.publicId,
                        width: res.data.data.width,
                        height: res.data.data.height,
                        altText: '',
                        displayOrder: variants[variantIndex].images?.length || 0,
                    };
                })
            );
            const current = variants[variantIndex];
            const updatedImages = [...(current.images || []), ...results];
            handleChange(variantIndex, { ...current, images: updatedImages });
            toast({ message: `${results.length} image(s) uploaded for ${current.color || 'color'}`, type: 'success' });
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Image upload failed', type: 'error' });
        } finally {
            setUploadingIndex(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Summary */}
            {variants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <Badge variant="success">{availableCount} in stock</Badge>
                    {outOfStockCount > 0 && (
                        <Badge variant="warning">{outOfStockCount} out of stock</Badge>
                    )}
                    <Badge variant="default">{uniqueColors} color{uniqueColors !== 1 ? 's' : ''}</Badge>
                    <Badge variant="default">{variants.length} variant{variants.length !== 1 ? 's' : ''}</Badge>
                </div>
            )}

            {/* Existing Color Variants */}
            {variants.length > 0 && (
                <div className="space-y-3">
                    {variants.map((v, i) => (
                        <ColorVariantCard
                            key={v._id || i}
                            variant={v}
                            index={i}
                            onChange={handleChange}
                            onRemove={handleRemove}
                            onImageUpload={handleImageUpload}
                            isUploading={uploadingIndex === i}
                        />
                    ))}
                </div>
            )}

            {/* Add New Color */}
            <div className="border border-dashed border-gray-200 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Add Color Variant</p>
                <div className="flex flex-wrap gap-2 items-end">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Color Name <span className="text-red-500">*</span></label>
                        <Input
                            value={newColor.color}
                            onChange={(e) => { setAddError(''); setNewColor((p) => ({ ...p, color: e.target.value })); }}
                            placeholder="Black, Navy..."
                            className="h-8 text-xs w-28"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Code</label>
                        <div className="flex items-center gap-1">
                            <input
                                type="color"
                                value={newColor.colorCode}
                                onChange={(e) => setNewColor((p) => ({ ...p, colorCode: e.target.value }))}
                                className="w-8 h-8 rounded border border-gray-200 cursor-pointer flex-shrink-0"
                            />
                            <Input
                                value={newColor.colorCode}
                                onChange={(e) => setNewColor((p) => ({ ...p, colorCode: e.target.value }))}
                                className="h-8 text-xs w-20 font-mono"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Size</label>
                        <Input
                            value={newColor.size}
                            onChange={(e) => setNewColor((p) => ({ ...p, size: e.target.value }))}
                            placeholder="Optional"
                            className="h-8 text-xs w-20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Stock</label>
                        <Input
                            type="number"
                            min="0"
                            value={newColor.stock}
                            onChange={(e) => { setAddError(''); setNewColor((p) => ({ ...p, stock: Number(e.target.value) })); }}
                            className="h-8 text-xs w-16"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">SKU</label>
                        <Input
                            value={newColor.sku}
                            onChange={(e) => setNewColor((p) => ({ ...p, sku: e.target.value }))}
                            placeholder="Optional"
                            className="h-8 text-xs w-24"
                        />
                    </div>
                    <Button type="button" size="sm" onClick={handleAdd}>
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add
                    </Button>
                </div>
                {addError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        {addError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VariantEditor;
