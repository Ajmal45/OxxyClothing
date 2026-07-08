import { useState, useEffect } from 'react';
import { storefrontService } from '../../../services/storefrontService';
import { ChevronDown, X } from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Beige', 'Navy', 'Grey', 'Brown', 'Purple', 'Yellow', 'Orange', 'Maroon', 'Teal', 'Coral'];

const FilterSidebar = ({ filters, onChange }) => {
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [priceOpen, setPriceOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(filters.minPrice || '');
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
    const [sizeOpen, setSizeOpen] = useState(false);
    const [colorOpen, setColorOpen] = useState(false);

    useEffect(() => {
        storefrontService.getCategories().then((r) => setCategories(r.data.data || [])).catch(() => {});
        storefrontService.getCollections().then((r) => setCollections(r.data.data || [])).catch(() => {});
    }, []);

    const update = (key, value) => {
        const next = { ...filters, page: '1' };
        if (value) next[key] = value;
        else delete next[key];
        onChange(next);
    };

    const applyPrice = () => {
        const next = { ...filters, page: '1' };
        if (minPrice) next.minPrice = minPrice;
        else delete next.minPrice;
        if (maxPrice) next.maxPrice = maxPrice;
        else delete next.maxPrice;
        onChange(next);
    };

    return (
        <aside className="space-y-8">
            <div>
                <h3 className="text-xs font-semibold tracking-wider uppercase text-oxxy-muted mb-4">Category</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => update('category', null)}
                        className={`block text-sm transition-colors ${!filters.category ? 'text-oxxy-black font-medium' : 'text-oxxy-muted hover:text-oxxy-black'}`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => update('category', cat.slug)}
                            className={`block text-sm transition-colors ${filters.category === cat.slug ? 'text-oxxy-black font-medium' : 'text-oxxy-muted hover:text-oxxy-black'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xs font-semibold tracking-wider uppercase text-oxxy-muted mb-4">Collection</h3>
                <div className="space-y-2">
                    {collections.map((col) => (
                        <button
                            key={col._id}
                            onClick={() => update('collection', col.slug)}
                            className={`block text-sm transition-colors ${filters.collection === col.slug ? 'text-oxxy-black font-medium' : 'text-oxxy-muted hover:text-oxxy-black'}`}
                        >
                            {col.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <button
                    onClick={() => setSizeOpen(!sizeOpen)}
                    className="flex items-center justify-between w-full text-xs font-semibold tracking-wider uppercase text-oxxy-muted"
                >
                    Size
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sizeOpen ? 'rotate-180' : ''}`} />
                </button>
                {sizeOpen && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {SIZES.map((size) => (
                            <button
                                key={size}
                                onClick={() => update('size', filters.size === size ? null : size)}
                                className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                                    filters.size === size
                                        ? 'bg-oxxy-black text-oxxy-white border-oxxy-black'
                                        : 'border-oxxy-black/20 text-oxxy-muted hover:border-oxxy-black hover:text-oxxy-black'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <button
                    onClick={() => setColorOpen(!colorOpen)}
                    className="flex items-center justify-between w-full text-xs font-semibold tracking-wider uppercase text-oxxy-muted"
                >
                    Color
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${colorOpen ? 'rotate-180' : ''}`} />
                </button>
                {colorOpen && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => update('color', filters.color === color ? null : color)}
                                className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                                    filters.color === color
                                        ? 'bg-oxxy-black text-oxxy-white border-oxxy-black'
                                        : 'border-oxxy-black/20 text-oxxy-muted hover:border-oxxy-black hover:text-oxxy-black'
                                }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <button
                    onClick={() => setPriceOpen(!priceOpen)}
                    className="flex items-center justify-between w-full text-xs font-semibold tracking-wider uppercase text-oxxy-muted"
                >
                    Price Range
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${priceOpen ? 'rotate-180' : ''}`} />
                </button>
                {priceOpen && (
                    <div className="mt-4 space-y-3">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            onBlur={applyPrice}
                            className="w-full px-3 py-2 border border-oxxy-black/20 text-sm focus:outline-none focus:border-oxxy-black"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            onBlur={applyPrice}
                            className="w-full px-3 py-2 border border-oxxy-black/20 text-sm focus:outline-none focus:border-oxxy-black"
                        />
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-xs font-semibold tracking-wider uppercase text-oxxy-muted mb-4">Other</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.isNewArrival === 'true'}
                            onChange={(e) => update('isNewArrival', e.target.checked ? 'true' : null)}
                            className="w-4 h-4 accent-black"
                        />
                        <span className="text-sm text-oxxy-black">New Arrivals</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.isFeatured === 'true'}
                            onChange={(e) => update('isFeatured', e.target.checked ? 'true' : null)}
                            className="w-4 h-4 accent-black"
                        />
                        <span className="text-sm text-oxxy-black">Featured</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.isAvailable === 'true'}
                            onChange={(e) => update('isAvailable', e.target.checked ? 'true' : null)}
                            className="w-4 h-4 accent-black"
                        />
                        <span className="text-sm text-oxxy-black">Available Only</span>
                    </label>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;