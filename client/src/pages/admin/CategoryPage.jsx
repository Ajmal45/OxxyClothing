import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Grid3X3, UploadCloud, X, Loader, ImageIcon } from 'lucide-react';
import { categoryService, imageService } from '../../services/apiServices';
import {
    Button, Input, Textarea, Toggle, Modal, ConfirmDialog,
    Badge, PageHeader, EmptyState, ErrorState, Spinner, useToast
} from '../../components/ui';

const slugify = (str) =>
    str.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required').trim(),
    description: z.string().optional(),
    displayOrder: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
});

const CategoryFormModal = ({ isOpen, onClose, category, onSuccess }) => {
    const { toast } = useToast();
    const isEditing = !!category;
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [slug, setSlug] = useState('');
    const fileInputRef = useRef(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: '', description: '', displayOrder: 0, isActive: true },
    });

    const watchedName = watch('name');

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                reset({
                    name: category.name,
                    description: category.description || '',
                    displayOrder: category.displayOrder ?? 0,
                    isActive: category.isActive ?? true,
                });
                setImage(category.image || null);
                setSlug(category.slug || '');
            } else {
                reset({ name: '', description: '', displayOrder: 0, isActive: true });
                setImage(null);
                setSlug('');
            }
        }
    }, [isOpen, category, isEditing, reset]);

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
            setImage({ url: res.data.data.url, publicId: res.data.data.publicId });
        } catch {
            toast({ message: 'Image upload failed', type: 'error' });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    const onSubmit = async (data) => {
        try {
            const payload = { ...data };
            if (image) payload.image = { url: image.url, publicId: image.publicId };
            if (isEditing) {
                await categoryService.update(category._id, payload);
                toast({ message: 'Category updated successfully', type: 'success' });
            } else {
                await categoryService.create(payload);
                toast({ message: 'Category created successfully', type: 'success' });
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Operation failed', type: 'error' });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Category' : 'Add Category'} maxWidth="max-w-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
                    <Input placeholder="e.g. Dresses" error={errors.name?.message} {...register('name')} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                    <Input value={slug} readOnly className="bg-gray-50 text-gray-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <Textarea placeholder="Optional description..." rows={3} {...register('description')} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                    <Input type="number" min="0" error={errors.displayOrder?.message} {...register('displayOrder')} />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Image</label>
                    {image ? (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <img src={image.url} alt="Category" className="h-16 w-16 object-cover rounded-lg bg-white" />
                            <span className="text-xs text-gray-400 font-mono truncate flex-1">{image.publicId}</span>
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
                                    <p className="text-xs text-gray-500">Click to upload category image</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Toggle
                    id="isActive"
                    label="Active (visible to customers)"
                    checked={watch('isActive')}
                    onChange={(val) => setValue('isActive', val)}
                />
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {isEditing ? 'Save Changes' : 'Create Category'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

const CategoryPage = () => {
    const { toast } = useToast();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await categoryService.getAll();
            setCategories(res.data.data || []);
        } catch {
            setError('Failed to load categories.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const handleAdd = () => { setEditTarget(null); setModalOpen(true); };
    const handleEdit = (cat) => { setEditTarget(cat); setModalOpen(true); };
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await categoryService.delete(deleteTarget._id);
            toast({ message: `"${deleteTarget.name}" deleted`, type: 'success' });
            setDeleteTarget(null);
            fetchCategories();
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Delete failed', type: 'error' });
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
    if (error) return <ErrorState title="Error" description={error} onRetry={fetchCategories} />;

    return (
        <div>
            <PageHeader
                title="Categories"
                description="Organise your products into categories"
                action={<Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Add Category</Button>}
            />

            {categories.length === 0 ? (
                <EmptyState
                    icon={Grid3X3}
                    title="No categories yet"
                    description="Create your first category to organise products."
                    action={<Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Add Category</Button>}
                />
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Slug</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Description</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Order</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map((cat) => (
                                    <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {cat.image?.url ? (
                                                    <img src={cat.image.url} alt={cat.name} className="h-8 w-8 rounded object-cover bg-gray-100 flex-shrink-0" />
                                                ) : (
                                                    <div className="h-8 w-8 rounded bg-gray-100 flex-shrink-0" />
                                                )}
                                                <span className="font-medium text-gray-900">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden sm:table-cell">{cat.slug}</td>
                                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate hidden md:table-cell">{cat.description || '—'}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={cat.isActive ? 'success' : 'warning'}>
                                                {cat.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{cat.displayOrder}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} aria-label="Edit">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(cat)} aria-label="Delete" className="text-red-500 hover:text-red-700 hover:bg-red-50">
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

            <CategoryFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                category={editTarget}
                onSuccess={fetchCategories}
            />

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone. Ensure no products are using this category first.`}
                confirmLabel="Delete"
                isLoading={deleting}
            />
        </div>
    );
};

export default CategoryPage;