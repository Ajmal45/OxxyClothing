import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Package, Filter, X, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { productService, categoryService, collectionService } from '../../services/apiServices';
import {
    Button, Input, Select, Badge, Pagination, PageHeader,
    EmptyState, ErrorState, Spinner, ConfirmDialog, useToast
} from '../../components/ui';

const useDebounce = (value, delay = 400) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
};

const ProductListPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { toast } = useToast();

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 12 });
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Filter state driven from URL params
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const debouncedSearch = useDebounce(search);
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category') || '';
    const collection = searchParams.get('collection') || '';
    const isAvailable = searchParams.get('isAvailable') || '';
    const isFeatured = searchParams.get('isFeatured') || '';
    const isNewArrival = searchParams.get('isNewArrival') || '';
    const sort = searchParams.get('sort') || 'newest';

    const updateParams = (updates) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(updates).forEach(([k, v]) => {
                if (v) next.set(k, v); else next.delete(k);
            });
            next.set('page', '1');
            return next;
        });
    };

    useEffect(() => {
        categoryService.getAll().then((r) => setCategories(r.data.data || []));
        collectionService.getAll().then((r) => setCollections(r.data.data || []));
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        const params = {
            page,
            limit: 12,
            sort,
            ...(debouncedSearch && { search: debouncedSearch }),
            ...(category && { category }),
            ...(collection && { collection }),
            ...(isAvailable && { isAvailable }),
            ...(isFeatured && { isFeatured }),
            ...(isNewArrival && { isNewArrival }),
        };
        try {
            const res = await productService.getAll(params);
            setProducts(res.data.data || []);
            setPagination(res.data.pagination || { page: 1, pages: 1, total: 0, limit: 12 });
        } catch {
            setError('Failed to load products.');
        } finally {
            setLoading(false);
        }
    }, [page, sort, debouncedSearch, category, collection, isAvailable, isFeatured, isNewArrival]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // Sync debounced search to URL
    useEffect(() => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (debouncedSearch) next.set('search', debouncedSearch);
            else next.delete('search');
            next.set('page', '1');
            return next;
        });
    }, [debouncedSearch]);

    const handleSoftDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await productService.softDelete(deleteTarget._id);
            toast({ message: `"${deleteTarget.name}" moved to trash`, type: 'success' });
            setDeleteTarget(null);
            fetchProducts();
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Delete failed', type: 'error' });
        } finally {
            setDeleting(false);
        }
    };

    const hasFilters = !!(category || collection || isAvailable || isFeatured || isNewArrival || debouncedSearch);
    const clearFilters = () => setSearchParams({ page: '1', sort });

    return (
        <div>
            <PageHeader
                title="Products"
                description={`${pagination.total} product${pagination.total !== 1 ? 's' : ''} total`}
                action={
                    <Button as={Link} onClick={() => navigate('/admin/products/create')}>
                        <Plus className="h-4 w-4 mr-2" />Add Product
                    </Button>
                }
            />

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <input
                            type="search"
                            placeholder="Search by name, code or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full pl-9 pr-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <Select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} className="w-full sm:w-44">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="name">Name A-Z</option>
                        <option value="display_order">Display Order</option>
                    </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Select value={category} onChange={(e) => updateParams({ category: e.target.value })} className="w-40">
                        <option value="">All Categories</option>
                        {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
                    </Select>
                    <Select value={collection} onChange={(e) => updateParams({ collection: e.target.value })} className="w-44">
                        <option value="">All Collections</option>
                        {collections.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
                    </Select>
                    <Select value={isAvailable} onChange={(e) => updateParams({ isAvailable: e.target.value })} className="w-36">
                        <option value="">Availability</option>
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                    </Select>
                    <Select value={isFeatured} onChange={(e) => updateParams({ isFeatured: e.target.value })} className="w-32">
                        <option value="">Featured</option>
                        <option value="true">Featured Only</option>
                    </Select>
                    <Select value={isNewArrival} onChange={(e) => updateParams({ isNewArrival: e.target.value })} className="w-36">
                        <option value="">New Arrivals</option>
                        <option value="true">New Arrivals Only</option>
                    </Select>
                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
                            <X className="h-3.5 w-3.5 mr-1" />Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex h-48 items-center justify-center">
                    <Spinner />
                </div>
            ) : error ? (
                <ErrorState title="Error" description={error} onRetry={fetchProducts} />
            ) : products.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title={hasFilters ? 'No products match your filters' : 'No products yet'}
                    description={hasFilters ? 'Try adjusting your search or filters.' : 'Create your first product to get started.'}
                    action={!hasFilters && <Button onClick={() => navigate('/admin/products/create')}><Plus className="h-4 w-4 mr-2" />Add Product</Button>}
                />
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Code</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Category</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Badges</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {p.images?.[0]?.url ? (
                                                    <img src={p.images[0].url} alt={p.images[0].altText || p.name} className="h-10 w-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                        <Package className="h-4 w-4 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 truncate max-w-[180px]">{p.name}</p>
                                                    <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-500 hidden md:table-cell">{p.productCode}</td>
                                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.category?.name || '—'}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">₹{p.price?.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={p.isAvailable ? 'success' : 'warning'}>
                                                {p.isAvailable ? 'Available' : 'Unavailable'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <div className="flex gap-1 flex-wrap">
                                                {p.isFeatured && <Badge variant="black">Featured</Badge>}
                                                {p.isNewArrival && <Badge variant="default">New</Badge>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/products/${p._id}/edit`)} aria-label="Edit product">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(p)} aria-label="Delete product" className="text-red-400 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        page={pagination.page}
                        pages={pagination.pages}
                        total={pagination.total}
                        limit={pagination.limit}
                        onPageChange={(p) => setSearchParams((prev) => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n; })}
                    />
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleSoftDelete}
                title="Move to Trash"
                message={`Move "${deleteTarget?.name}" to trash? You can restore it later from the Trash section.`}
                confirmLabel="Move to Trash"
                isLoading={deleting}
            />
        </div>
    );
};

export default ProductListPage;
