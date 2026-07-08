import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value = '', onChange, placeholder = 'Search products...' }) => {
    const [local, setLocal] = useState(value);
    const timer = useRef(null);

    useEffect(() => {
        setLocal(value);
    }, [value]);

    const handleChange = (e) => {
        const v = e.target.value;
        setLocal(v);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => onChange(v), 300);
    };

    const handleClear = () => {
        setLocal('');
        onChange('');
    };

    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-oxxy-muted" />
            <input
                type="text"
                value={local}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full pl-12 pr-10 py-3.5 bg-transparent border border-oxxy-black/20 text-sm text-oxxy-black placeholder:text-oxxy-muted focus:outline-none focus:border-oxxy-black transition-colors"
                aria-label="Search products"
            />
            {local && (
                <button
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-oxxy-muted hover:text-oxxy-black transition-colors"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;