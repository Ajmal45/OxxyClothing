import { X } from 'lucide-react';

const FILTER_LABELS = {
    category: 'Category',
    collection: 'Collection',
    size: 'Size',
    color: 'Color',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    search: 'Search',
    isNewArrival: 'New Arrivals',
    isFeatured: 'Featured',
};

const FilterChips = ({ filters, onRemove }) => {
    const chips = [];

    if (filters.search) chips.push({ key: 'search', label: `"${filters.search}"` });
    if (filters.category) chips.push({ key: 'category', label: filters.category });
    if (filters.collection) chips.push({ key: 'collection', label: filters.collection });
    if (filters.size) chips.push({ key: 'size', label: `Size: ${filters.size}` });
    if (filters.color) chips.push({ key: 'color', label: `Color: ${filters.color}` });
    if (filters.minPrice) chips.push({ key: 'minPrice', label: `Min: ₹${filters.minPrice}` });
    if (filters.maxPrice) chips.push({ key: 'maxPrice', label: `Max: ₹${filters.maxPrice}` });
    if (filters.isNewArrival === 'true') chips.push({ key: 'isNewArrival', label: 'New Arrivals' });
    if (filters.isFeatured === 'true') chips.push({ key: 'isFeatured', label: 'Featured' });

    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
                <span
                    key={chip.key}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-oxxy-black text-oxxy-white text-xs font-medium"
                >
                    {chip.label}
                    <button
                        onClick={() => onRemove(chip.key)}
                        className="hover:text-oxxy-muted transition-colors"
                        aria-label={`Remove ${chip.key} filter`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </span>
            ))}
            <button
                onClick={() => onRemove('all')}
                className="text-xs text-oxxy-muted underline underline-offset-2 hover:text-oxxy-black transition-colors"
            >
                Clear all
            </button>
        </div>
    );
};

export default FilterChips;