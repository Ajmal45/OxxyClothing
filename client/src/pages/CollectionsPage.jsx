import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { storefrontService } from '../services/storefrontService';
import ProductGrid from '../components/storefront/product/ProductGrid';
import SearchBar from '../components/storefront/filters/SearchBar';
import SortSelect from '../components/storefront/filters/SortSelect';
import FilterChips from '../components/storefront/filters/FilterChips';
import FilterSidebar from '../components/storefront/filters/FilterSidebar';
import FilterDrawer from '../components/storefront/filters/FilterDrawer';
import SectionHeading from '../components/storefront/ui/SectionHeading';
import { updateSEO } from '../utils/seo';
import { Pagination } from '../components/ui';

const CollectionsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const filters = Object.fromEntries(searchParams.entries());

    const fetchProducts = useCallback(async (params) => {
        setLoading(true);
        setError(null);
        try {
            const res = await storefrontService.getProducts(params);
            setProducts(res.data.data || []);
            setPagination(res.data.pagination || null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(filters);
    }, [searchParams]);

    useEffect(() => {
        updateSEO({
            title: filters.search ? `Search: ${filters.search}` : 'Collections',
            description: 'Browse our complete collection of premium women\'s fashion.',
        });
    }, [filters.search]);

    const updateFilters = (updates) => {
        const next = { ...filters, ...updates };
        Object.keys(next).forEach((k) => { if (!next[k]) delete next[k]; });
        setSearchParams(next, { replace: true });
    };

    const removeFilter = (key) => {
        if (key === 'all') {
            setSearchParams({}, { replace: true });
            return;
        }
        const next = { ...filters };
        delete next[key];
        setSearchParams(next, { replace: true });
    };

    const handlePageChange = (page) => {
        updateFilters({ page: String(page) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalFilters = Object.keys(filters).filter((k) => k !== 'sort' && k !== 'page' && filters[k]).length;

    return (
        <div className="pt-24 lg:pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-5 lg:px-8">
                <SectionHeading
                    label="Collections"
                    heading={filters.search ? `Search: "${filters.search}"` : 'All Products'}
                    align="left"
                    className="mb-8"
                />

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <FilterSidebar filters={filters} onChange={updateFilters} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                            <div className="flex-1 w-full sm:w-auto">
                                <SearchBar
                                    value={filters.search || ''}
                                    onChange={(v) => updateFilters({ search: v || undefined, page: '1' })}
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="flex-1 sm:flex-initial">
                                    <SortSelect
                                        value={filters.sort || 'NEWEST'}
                                        onChange={(v) => updateFilters({ sort: v, page: '1' })}
                                    />
                                </div>
                                <button
                                    onClick={() => setDrawerOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-3.5 border border-oxxy-black/20 text-sm hover:border-oxxy-black transition-colors"
                                    aria-label="Open filters"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filters{totalFilters > 0 ? ` (${totalFilters})` : ''}
                                </button>
                            </div>
                        </div>

                        <FilterChips filters={filters} onRemove={removeFilter} />

                        {error ? (
                            <div className="text-center py-20">
                                <p className="text-sm text-red-500 mb-4">{error}</p>
                                <button
                                    onClick={() => fetchProducts(filters)}
                                    className="px-6 py-2.5 bg-oxxy-black text-oxxy-white text-sm font-medium"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div className="mt-6">
                                <ProductGrid products={products} loading={loading} />
                                {pagination && pagination.pages > 1 && (
                                    <div className="mt-12">
                                        <Pagination
                                            page={pagination.page}
                                            pages={pagination.pages}
                                            total={pagination.total}
                                            limit={pagination.limit}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FilterDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                filters={filters}
                onChange={(f) => { updateFilters(f); setDrawerOpen(false); }}
            />
        </div>
    );
};

export default CollectionsPage;