import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({ className = '', error, children, ...props }, ref) => {
    return (
        <div className="w-full relative">
            <select
                ref={ref}
                className={`flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
                    error ? 'border-red-500 focus:ring-red-500' : ''
                } ${className}`}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
});

Select.displayName = 'Select';

export { Select };
