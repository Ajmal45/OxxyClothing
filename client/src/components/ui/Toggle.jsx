import React from 'react';

const Toggle = ({ checked, onChange, disabled = false, label, id }) => {
    return (
        <label htmlFor={id} className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
                <input
                    id={id}
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
                <div
                    className={`block w-11 h-6 rounded-full transition-colors ${
                        checked ? 'bg-black' : 'bg-gray-300'
                    } ${disabled ? 'opacity-50' : ''}`}
                />
                <div
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </div>
            {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        </label>
    );
};

export { Toggle };
