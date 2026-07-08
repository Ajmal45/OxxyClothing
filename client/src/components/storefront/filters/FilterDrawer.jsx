import { useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import FilterSidebar from './FilterSidebar';

const FilterDrawer = ({ open, onClose, filters, onChange }) => {
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-oxxy-white z-50 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="text-sm font-semibold tracking-wider uppercase">Filters</h2>
                            <button onClick={onClose} className="p-1" aria-label="Close filters">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-5">
                            <FilterSidebar filters={filters} onChange={onChange} />
                        </div>
                        <div className="sticky bottom-0 p-5 border-t border-gray-100 bg-oxxy-white">
                            <button
                                onClick={onClose}
                                className="w-full py-3.5 bg-oxxy-black text-oxxy-white text-sm font-semibold tracking-wider uppercase"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterDrawer;