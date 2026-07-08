import { ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
    { value: 'NEWEST', label: 'Newest' },
    { value: 'OLDEST', label: 'Oldest' },
    { value: 'PRICE_ASC', label: 'Price: Low to High' },
    { value: 'PRICE_DESC', label: 'Price: High to Low' },
    { value: 'NAME', label: 'Alphabetical' },
    { value: 'DISPLAY_ORDER', label: 'Featured' },
];

const SortSelect = ({ value = 'NEWEST', onChange }) => {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none w-full px-4 py-3.5 pr-10 bg-transparent border border-oxxy-black/20 text-sm text-oxxy-black focus:outline-none focus:border-oxxy-black transition-colors cursor-pointer"
                aria-label="Sort products"
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-oxxy-muted pointer-events-none" />
        </div>
    );
};

export default SortSelect;