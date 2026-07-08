import { useState, useEffect, useCallback } from 'react';
import { Trash2, RotateCcw, Package, AlertTriangle } from 'lucide-react';
import { productService } from '../../services/apiServices';
import {
    Button, Badge, Pagination, PageHeader, EmptyState, ErrorState, Spinner,
    ConfirmDialog, useToast
} from '../../components/ui';

const TrashPage = () => {
    const { toast } = useToast();
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 12 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const [restoreTarget, setRestoreTarget] = useState(null);
    const [permanentTarget, setPermanentTarget] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchTrashed = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await productService.getAll({ isDeleted: 'true', limit: 100 });
            setProducts(res.data.data || []);
            setPagination(res.data.pagination || { page: 1, pages: 1, total: 0, limit: 100 });
        } catch {
            setError('Failed to load trash.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTrashed(); }, [fetchTrashed]);

    const handleRestore = async () => {
        if (!restoreTarget) return;
        setActionLoading(true);
        try {
            await productService.restore(restoreTarget._id);
            toast({ message: `"${restoreTarget.name}" restored successfully`, type: 'success' });
            setRestoreTarget(null);
            fetchTrashed();
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Restore failed', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const handlePermanentDelete = async () => {
        if (!permanentTarget) return;
        setActionLoading(true);
        try {
            await productService.permanentDelete(permanentTarget._id);
            toast({ message: `"${permanentTarget.name}" permanently deleted. Cloudinary images removed.`, type: 'success' });
            setPermanentTarget(null);
            fetchTrashed();
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Permanent delete failed', type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
    if (error) return <ErrorState title="Error" description={error} onRetry={fetchTrashed} />;

    return (
        <div>
            <PageHeader
                title="Trash"
                description={`${products.length} deleted product${products.length !== 1 ? 's' : ''}`}
            />

            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-amber-800">Trash Management</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                        Restoring a product makes it live again. Permanent deletion is irreversible and will also remove all Cloudinary images.
                    </p>
                </div>
            </div>

            {products.length === 0 ? (
                <EmptyState icon={Trash2} title="Trash is empty" description="Soft-deleted products will appear here." />
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Code</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Deleted</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {p.images?.[0]?.url ? (
                                                    <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded-lg object-cover bg-gray-100 flex-shrink-0 opacity-60" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                        <Package className="h-4 w-4 text-gray-300" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-700">{p.name}</p>
                                                    <Badge variant="warning" className="mt-0.5">Deleted</Badge>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-400 hidden sm:table-cell">{p.productCode}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">
                                            {p.deletedAt ? new Date(p.deletedAt).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => setRestoreTarget(p)}>
                                                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Restore
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => setPermanentTarget(p)}>
                                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete Forever
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!restoreTarget}
                onClose={() => setRestoreTarget(null)}
                onConfirm={handleRestore}
                title="Restore Product"
                message={`Restore "${restoreTarget?.name}"? It will become visible to customers again.`}
                confirmLabel="Restore"
                confirmVariant="primary"
                isLoading={actionLoading}
            />

            <ConfirmDialog
                isOpen={!!permanentTarget}
                onClose={() => setPermanentTarget(null)}
                onConfirm={handlePermanentDelete}
                title="⚠️ Permanently Delete Product"
                message={`This will PERMANENTLY delete "${permanentTarget?.name}" and remove all its images from Cloudinary. This action cannot be undone.`}
                confirmLabel="Delete Forever"
                confirmVariant="danger"
                isLoading={actionLoading}
            />
        </div>
    );
};

export default TrashPage;
