import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, FolderOpen, Star, UploadCloud, X, Loader } from 'lucide-react';
import { collectionService, imageService } from '../../services/apiServices';
import {
    Button, Input, Textarea, Toggle, Select, Modal, ConfirmDialog,
    Badge, PageHeader, EmptyState, ErrorState, Spinner, useToast
} from '../../components/ui';

const slugify = (str) =>
    str.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const collectionSchema = z.object({
    name: z.string().min(1, 'Collection name is required').trim(),
    description: z.string().optional(),
    displayOrder: z.coerce.number().int().min(0).default(0),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

const CollectionFormModal = ({ isOpen, onClose, collection, onSuccess }) => {
    const { toast } = useToast();
    const isEditing = !!collection;
    const [coverImage, setCoverImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [slug, setSlug] = useState('');
    const fileInputRef = useRef(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(collectionSchema),
        defaultValues: { name: '', description: '', displayOrder: 0, isFeatured: false, isActive: true, seoTitle: '', seoDescription: '' },
    });

    const watchedName = watch('name');

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                reset({
                    name: collection.name,
                    description: collection.description || '',
                    displayOrder: collection.displayOrder ?? 0,
                    isFeatured: collection.isFeatured ?? false,
                    isActive: collection.isActive ?? true,
                    seoTitle: collection.seoTitle || '',
                    seoDescription: collection.seoDescription || '',
                });
                setCoverImage(collection.coverImage || null);
                setSlug(collection.slug || '');
            } else {
                reset({ name: '', description: '', displayOrder: 0, isFeatured: false, isActive: true, seoTitle: '', seoDescription: '' });
                setCoverImage(null);
                setSlug('');
            }
        }
    }, [isOpen, collection, isEditing, reset]);

    useEffect(() => {
        if (!isEditing && watchedName) {
            setSlug(slugify(watchedName));
        }
    }, [watchedName, isEditing]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast({ message: 'Please select an image file.', type: 'error' });
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await imageService.upload(formData);
            setCoverImage({ url: res.data.data.url, publicId: res.data.data.publicId, altText: '' });
        } catch {
            toast({ message: 'Image upload failed', type: 'error' });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = () => setCoverImage(null);

    const onSubmit = async (data) => {
        try {
            const payload = { ...data };
            if (coverImage) payload.coverImage = coverImage;
            if (isEditing) {
                await collectionService.update(collection._id, payload);
                toast({ message: 'Collection updated successfully', type: 'success' });
            } else {
                await collectionService.create(payload);
                toast({ message: 'Collection created successfully', type: 'success' });
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Operation failed', type: 'error' });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Collection' : 'Add Collection'} maxWidth="max-w-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
                    <Input placeholder="e.g. Summer 2026" error={errors.name?.message} {...register('name')} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                    <Input value={slug} readOnly className="bg-gray-50 text-gray-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <Textarea placeholder="Optional description..." rows={3} {...register('description')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                        <Input type="number" min="0" {...register('displayOrder')} />
                    </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
                    {coverImage ? (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <img src={coverImage.url} alt="Cover" className="h-16 w-16 object-cover rounded-lg bg-white" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-400 font-mono truncate">{coverImage.publicId}</p>
                            </div>
                            <button type="button" onClick={removeImage} className="text-gray-300 hover:text-red-500" aria-label="Remove image">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                            {uploading ? (
                                <Loader className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
                            ) : (
                                <div>
                                    <UploadCloud className="h-6 w-6 text-gray-300 mx-auto mb-1" />
                                    <p className="text-xs text-gray-500">Click to upload cover image</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <Toggle id="isFeatured" label="Featured Collection" checked={watch('isFeatured')} onChange={(v) => setValue('isFeatured', v)} />
                    <Toggle id="col-isActive" label="Active (visible to customers)" checked={watch('isActive')} onChange={(v) => setValue('isActive', v)} />
                </div>
                <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">SEO</p>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Title</label>
                            <Input placeholder="Optional SEO title..." {...register('seoTitle')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Description</label>
                            <Textarea placeholder="Optional SEO description..." rows={2} {...register('seoDescription')} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {isEditing ? 'Save Changes' : 'Create Collection'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

const CollectionPage = () => {
    const { toast } = useToast();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchCollections = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await collectionService.getAll();
            setCollections(res.data.data || []);
        } catch {
            setError('Failed to load collections.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCollections(); }, [fetchCollections]);

    const handleAdd = () => { setEditTarget(null); setModalOpen(true); };
    const handleEdit = (col) => { setEditTarget(col); setModalOpen(true); };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await collectionService.delete(deleteTarget._id);
            toast({ message: `"${deleteTarget.name}" deleted`, type: 'success' });
            setDeleteTarget(null);
            fetchCollections();
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Delete failed', type: 'error' });
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
    if (error) return <ErrorState title="Error" description={error} onRetry={fetchCollections} />;

    return (
        <div>
            <PageHeader
                title="Collections"
                description="Group products into thematic collections and campaigns"
                action={<Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Add Collection</Button>}
            />

            {collections.length === 0 ? (
                <EmptyState
                    icon={FolderOpen}
                    title="No collections yet"
                    description="Create your first collection to group products."
                    action={<Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Add Collection</Button>}
                />
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Slug</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Products</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Featured</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Order</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {collections.map((col) => (
                                    <tr key={col._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {col.coverImage?.url ? (
                                                    <img src={col.coverImage.url} alt={col.name} className="h-8 w-8 rounded object-cover bg-gray-100 flex-shrink-0" />
                                                ) : (
                                                    <div className="h-8 w-8 rounded bg-gray-100 flex-shrink-0" />
                                                )}
                                                <span className="font-medium text-gray-900">{col.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden sm:table-cell">{col.slug}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={col.isActive ? 'success' : 'warning'}>
                                                {col.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{col.productCount ?? '—'}</td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            {col.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />}
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{col.displayOrder}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(col)} aria-label="Edit">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(col)} aria-label="Delete" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-3.5 w-3.5" />
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

            <CollectionFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                collection={editTarget}
                onSuccess={fetchCollections}
            />
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Collection"
                message={`Delete "${deleteTarget?.name}"? Products in this collection will not be deleted, only the collection itself.`}
                confirmLabel="Delete"
                isLoading={deleting}
            />
        </div>
    );
};

export default CollectionPage;