import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft, AlertTriangle } from 'lucide-react';
import { productService, categoryService, collectionService } from '../../services/apiServices';
import {
    Button, Input, Textarea, Select, Toggle, PageHeader, FormSection, Spinner, ErrorState, useToast
} from '../../components/ui';
import ImageUploader from '../../components/ImageUploader';
import VariantEditor from '../../components/VariantEditor';

const slugify = (str) =>
    str.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const productSchema = z.object({
    name: z.string().min(1, 'Product name is required').trim(),
    slug: z.string().min(1, 'Slug is required').trim(),
    productCode: z.string().min(1, 'Product code is required').trim(),
    description: z.string().min(1, 'Description is required').trim(),
    price: z.coerce.number({ invalid_type_error: 'Price must be a number' }).min(0, 'Price must be 0 or more'),
    category: z.string().min(1, 'Category is required'),
    displayOrder: z.coerce.number().int().min(0).default(0),
    isFeatured: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

const ProductFormPage = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();
    const { toast } = useToast();

    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [images, setImages] = useState([]);
    const [variants, setVariants] = useState([]);
    const [loadingData, setLoadingData] = useState(isEditing);
    const [loadError, setLoadError] = useState(null);
    const [isDirty, setIsDirty] = useState(false);

    const {
        register, handleSubmit, reset, setValue, watch,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: { name: '', slug: '', productCode: '', description: '', price: 0, category: '', displayOrder: 0, isFeatured: false, isNewArrival: false, seoTitle: '', seoDescription: '' }
    });

    const watchedName = watch('name');

    // Auto-generate slug from name (only when not editing or slug hasn't been manually set)
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    useEffect(() => {
        if (!isEditing && !slugManuallyEdited && watchedName) {
            setValue('slug', slugify(watchedName));
        }
    }, [watchedName, isEditing, slugManuallyEdited, setValue]);

    // Load categories/collections
    useEffect(() => {
        const load = async () => {
            try {
                const [catRes, colRes] = await Promise.all([categoryService.getAll(), collectionService.getAll()]);
                setCategories(catRes.data.data || []);
                setCollections(colRes.data.data || []);
            } catch { /* silent */ }
        };
        load();
    }, []);

    // Load product data for editing
    useEffect(() => {
        if (!isEditing) return;
        const load = async () => {
            setLoadingData(true);
            try {
                const res = await productService.getById(id);
                const p = res.data.data;
                reset({
                    name: p.name,
                    slug: p.slug,
                    productCode: p.productCode,
                    description: p.description,
                    price: p.price,
                    category: p.category?._id || '',
                    displayOrder: p.displayOrder ?? 0,
                    isFeatured: p.isFeatured ?? false,
                    isNewArrival: p.isNewArrival ?? false,
                    seoTitle: p.seoTitle || '',
                    seoDescription: p.seoDescription || '',
                });
                setImages(p.images || []);
                setVariants(p.variants || []);
                setSelectedCollections((p.collections || []).map((c) => c._id || c));
                setSlugManuallyEdited(true);
            } catch {
                setLoadError('Failed to load product. It may have been deleted.');
            } finally {
                setLoadingData(false);
            }
        };
        load();
    }, [id, isEditing, reset]);

    const toggleCollection = (colId) => {
        setSelectedCollections((prev) =>
            prev.includes(colId) ? prev.filter((c) => c !== colId) : [...prev, colId]
        );
        setIsDirty(true);
    };

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            collections: selectedCollections,
            images: images.map((img, i) => ({ ...img, displayOrder: i })),
            variants,
        };
        try {
            if (isEditing) {
                await productService.update(id, payload);
                toast({ message: 'Product updated successfully', type: 'success' });
            } else {
                await productService.create(payload);
                toast({ message: 'Product created successfully', type: 'success' });
                navigate('/admin/products');
            }
            setIsDirty(false);
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Save failed. Check all fields.', type: 'error' });
        }
    };

    if (loadingData) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
    if (loadError) return <ErrorState title="Not Found" description={loadError} onRetry={() => navigate('/admin/products')} />;

    return (
        <div>
            <PageHeader
                title={isEditing ? 'Edit Product' : 'Create Product'}
                description={isEditing ? `Editing: ${watch('name') || '...'}` : 'Fill in the details to add a new product'}
                action={
                    <Button variant="outline" onClick={() => navigate('/admin/products')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />Back
                    </Button>
                }
            />

            <form onSubmit={handleSubmit(onSubmit, () => toast({ message: 'Please fix form errors before saving.', type: 'error' }))} onChange={() => setIsDirty(true)} className="space-y-5">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    {/* Left Column */}
                    <div className="xl:col-span-2 space-y-5">
                        <FormSection title="Basic Information" description="Core product details visible to customers">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                                    <Input placeholder="e.g. Floral Maxi Dress" error={errors.name?.message} {...register('name')} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug <span className="text-red-500">*</span></label>
                                        <Input
                                            placeholder="floral-maxi-dress"
                                            error={errors.slug?.message}
                                            {...register('slug')}
                                            onFocus={() => setSlugManuallyEdited(true)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Code <span className="text-red-500">*</span></label>
                                        <Input placeholder="DRESS-001" error={errors.productCode?.message} {...register('productCode')} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                                    <Textarea placeholder="Describe the product..." rows={5} error={errors.description?.message} {...register('description')} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
                                        <Input type="number" min="0" step="0.01" placeholder="2500" error={errors.price?.message} {...register('price')} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                                        <Input type="number" min="0" {...register('displayOrder')} />
                                    </div>
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Product Images" description="Upload and organise product photos. First image is the cover.">
                            <ImageUploader images={images} onChange={(imgs) => { setImages(imgs); setIsDirty(true); }} />
                        </FormSection>

                        <FormSection title="Variants" description="Manage sizes, colors, and stock levels.">
                            <VariantEditor variants={variants} onChange={(v) => { setVariants(v); setIsDirty(true); }} />
                        </FormSection>

                        <FormSection title="SEO" description="Search engine optimisation settings">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Title</label>
                                    <Input placeholder="Optional SEO title override..." {...register('seoTitle')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Description</label>
                                    <Textarea placeholder="Optional SEO description..." rows={2} {...register('seoDescription')} />
                                </div>
                            </div>
                        </FormSection>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        <FormSection title="Category & Collections">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                                    <Select error={errors.category?.message} {...register('category')}>
                                        <option value="">Select a category...</option>
                                        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Collections</label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {collections.map((col) => (
                                            <label key={col._id} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCollections.includes(col._id)}
                                                    onChange={() => toggleCollection(col._id)}
                                                    className="h-4 w-4 rounded accent-black"
                                                />
                                                <span className="text-sm text-gray-700">{col.name}</span>
                                            </label>
                                        ))}
                                        {collections.length === 0 && <p className="text-xs text-gray-400">No collections. Create one first.</p>}
                                    </div>
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Visibility & Flags">
                            <div className="space-y-4">
                                <Toggle
                                    id="isFeatured"
                                    label="Featured Product"
                                    checked={watch('isFeatured')}
                                    onChange={(v) => { setValue('isFeatured', v); setIsDirty(true); }}
                                />
                                <Toggle
                                    id="isNewArrival"
                                    label="New Arrival"
                                    checked={watch('isNewArrival')}
                                    onChange={(v) => { setValue('isNewArrival', v); setIsDirty(true); }}
                                />
                            </div>
                        </FormSection>

                        {/* Unsaved warning */}
                        {isDirty && (
                            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-700">You have unsaved changes.</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full" isLoading={isSubmitting}>
                            <Save className="h-4 w-4 mr-2" />
                            {isEditing ? 'Save Changes' : 'Create Product'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;
