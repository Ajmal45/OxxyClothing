import { useState } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input, Toggle, Badge } from './ui';

const EMPTY_VARIANT = { size: '', color: '', stock: 0, sku: '', isActive: true };

const VariantEditor = ({ variants, onChange }) => {
    const [newVariant, setNewVariant] = useState(EMPTY_VARIANT);
    const [addError, setAddError] = useState('');

    const availableCount = variants.filter((v) => v.isActive && v.stock > 0).length;
    const outOfStockCount = variants.filter((v) => v.isActive && v.stock === 0).length;

    const hasDuplicate = (size, color, excludeIndex = -1) =>
        variants.some(
            (v, i) =>
                i !== excludeIndex &&
                v.size.trim().toLowerCase() === size.trim().toLowerCase() &&
                v.color.trim().toLowerCase() === color.trim().toLowerCase()
        );

    const handleAdd = () => {
        setAddError('');
        if (!newVariant.size.trim() || !newVariant.color.trim()) {
            setAddError('Size and Color are required.');
            return;
        }
        if (hasDuplicate(newVariant.size, newVariant.color)) {
            setAddError(`Variant ${newVariant.size.trim()} / ${newVariant.color.trim()} already exists.`);
            return;
        }
        if (Number(newVariant.stock) < 0) {
            setAddError('Stock must be 0 or more.');
            return;
        }
        onChange([...variants, { ...newVariant, stock: Number(newVariant.stock) }]);
        setNewVariant(EMPTY_VARIANT);
    };

    const handleRemove = (index) => {
        onChange(variants.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const updated = variants.map((v, i) => {
            if (i !== index) return v;
            return { ...v, [field]: field === 'stock' ? Number(value) : value };
        });
        onChange(updated);
    };

    const handleToggleActive = (index, val) => {
        handleChange(index, 'isActive', val);
    };

    return (
        <div className="space-y-4">
            {/* Summary */}
            {variants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <Badge variant="success">{availableCount} available variant{availableCount !== 1 ? 's' : ''}</Badge>
                    {outOfStockCount > 0 && (
                        <Badge variant="warning">{outOfStockCount} out of stock</Badge>
                    )}
                    <Badge variant="default">{variants.length} total</Badge>
                </div>
            )}

            {/* Existing Variants */}
            {variants.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">Size</th>
                                    <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">Color</th>
                                    <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">Stock</th>
                                    <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs hidden sm:table-cell">SKU</th>
                                    <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">Active</th>
                                    <th className="text-right px-3 py-2 font-medium text-gray-500 text-xs">Remove</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {variants.map((v, i) => (
                                    <tr key={i} className={`${!v.isActive ? 'opacity-50' : ''}`}>
                                        <td className="px-3 py-2">
                                            <Input
                                                value={v.size}
                                                onChange={(e) => handleChange(i, 'size', e.target.value)}
                                                className="h-8 text-xs w-20"
                                                placeholder="M"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input
                                                value={v.color}
                                                onChange={(e) => handleChange(i, 'color', e.target.value)}
                                                className="h-8 text-xs w-24"
                                                placeholder="Red"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                value={v.stock}
                                                onChange={(e) => handleChange(i, 'stock', e.target.value)}
                                                className="h-8 text-xs w-20"
                                            />
                                        </td>
                                        <td className="px-3 py-2 hidden sm:table-cell">
                                            <Input
                                                value={v.sku || ''}
                                                onChange={(e) => handleChange(i, 'sku', e.target.value)}
                                                className="h-8 text-xs w-28"
                                                placeholder="SKU-001"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Toggle
                                                id={`variant-active-${i}`}
                                                checked={v.isActive}
                                                onChange={(val) => handleToggleActive(i, val)}
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemove(i)}
                                                aria-label="Remove variant"
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add New Variant Row */}
            <div className="border border-dashed border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Add Variant</p>
                <div className="flex flex-wrap gap-2 items-end">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Size <span className="text-red-500">*</span></label>
                        <Input
                            value={newVariant.size}
                            onChange={(e) => { setAddError(''); setNewVariant((p) => ({ ...p, size: e.target.value })); }}
                            placeholder="M, L, XL..."
                            className="h-8 text-xs w-24"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Color <span className="text-red-500">*</span></label>
                        <Input
                            value={newVariant.color}
                            onChange={(e) => { setAddError(''); setNewVariant((p) => ({ ...p, color: e.target.value })); }}
                            placeholder="Red, Blue..."
                            className="h-8 text-xs w-28"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Stock</label>
                        <Input
                            type="number"
                            min="0"
                            value={newVariant.stock}
                            onChange={(e) => { setAddError(''); setNewVariant((p) => ({ ...p, stock: Number(e.target.value) })); }}
                            className="h-8 text-xs w-20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">SKU</label>
                        <Input
                            value={newVariant.sku}
                            onChange={(e) => setNewVariant((p) => ({ ...p, sku: e.target.value }))}
                            placeholder="Optional"
                            className="h-8 text-xs w-28"
                        />
                    </div>
                    <Button type="button" size="sm" onClick={handleAdd}>
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add
                    </Button>
                </div>
                {addError && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        {addError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VariantEditor;
