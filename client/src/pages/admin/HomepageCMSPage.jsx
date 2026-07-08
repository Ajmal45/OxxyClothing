import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, UploadCloud, X, Loader } from 'lucide-react';
import { homepageService, collectionService, productService, imageService } from '../../services/apiServices';
import {
    Button, Input, Textarea, Select, PageHeader, FormSection, Spinner, ErrorState, useToast
} from '../../components/ui';

const homepageSchema = z.object({
    heroHeading: z.string().optional(),
    heroSubtitle: z.string().optional(),
    heroCTA: z.string().optional(),
    heroCTALink: z.string().optional(),
    brandStatement: z.string().optional(),
    brandStoryHeading: z.string().optional(),
    brandStoryText: z.string().optional(),
    campaignHeading: z.string().optional(),
    campaignSubtitle: z.string().optional(),
    campaignCTA: z.string().optional(),
    featuredCollection: z.string().optional().nullable(),
    aboutText: z.string().optional(),
    whatsappCTAHeading: z.string().optional(),
    whatsappCTAText: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

const MediaUploader = ({ label, value, onChange, acceptVideo = false }) => {
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await imageService.upload(formData);
            if (acceptVideo && file.type.startsWith('video/')) {
                onChange({ url: res.data.data.url, publicId: res.data.data.publicId, type: 'video' });
            } else {
                onChange({ url: res.data.data.url, publicId: res.data.data.publicId, type: 'image' });
            }
        } catch {
            toast({ message: 'Upload failed', type: 'error' });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            {value?.url ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {value.type === 'video' ? (
                        <video src={value.url} className="h-16 w-16 object-cover rounded-lg bg-white" />
                    ) : (
                        <img src={value.url} alt={label} className="h-16 w-16 object-cover rounded-lg bg-white" />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-mono truncate">{value.publicId}</p>
                        {value.type === 'video' && <span className="text-xs text-blue-500 font-medium">Video</span>}
                    </div>
                    <button type="button" onClick={() => onChange(null)} className="text-gray-300 hover:text-red-500" aria-label={`Remove ${label}`}>
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                    <input ref={fileInputRef} type="file" accept={acceptVideo ? 'image/*,video/*' : 'image/*'} className="sr-only" onChange={handleFile} />
                    {uploading ? (
                        <Loader className="h-5 w-5 animate-spin text-gray-400 mx-auto" />
                    ) : (
                        <div>
                            <UploadCloud className="h-5 w-5 text-gray-300 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">Click to upload {acceptVideo ? 'image or video' : 'image'}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const HomepageCMSPage = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collections, setCollections] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedFeaturedProducts, setSelectedFeaturedProducts] = useState([]);
    const [heroMedia, setHeroMedia] = useState(null);
    const [brandStoryImage, setBrandStoryImage] = useState(null);
    const [campaignImage, setCampaignImage] = useState(null);
    const [aboutImage, setAboutImage] = useState(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(homepageSchema),
    });

    useEffect(() => {
        const load = async () => {
            try {
                const [homepageRes, collectionsRes, productsRes] = await Promise.all([
                    homepageService.get(),
                    collectionService.getAll(),
                    productService.getAll({ limit: 50 }),
                ]);
                const hp = homepageRes.data.data;
                setCollections(collectionsRes.data.data || []);
                setAllProducts(productsRes.data.data || []);

                if (hp) {
                    reset({
                        heroHeading: hp.heroHeading || '',
                        heroSubtitle: hp.heroSubtitle || '',
                        heroCTA: hp.heroCTA || '',
                        heroCTALink: hp.heroCTALink || '',
                        brandStatement: hp.brandStatement || '',
                        brandStoryHeading: hp.brandStoryHeading || '',
                        brandStoryText: hp.brandStoryText || '',
                        campaignHeading: hp.campaignHeading || '',
                        campaignSubtitle: hp.campaignSubtitle || '',
                        campaignCTA: hp.campaignCTA || '',
                        featuredCollection: hp.featuredCollection?._id || hp.featuredCollection || '',
                        aboutText: hp.aboutText || '',
                        whatsappCTAHeading: hp.whatsappCTAHeading || '',
                        whatsappCTAText: hp.whatsappCTAText || '',
                        seoTitle: hp.seoTitle || '',
                        seoDescription: hp.seoDescription || '',
                    });
                    setHeroMedia(hp.heroMedia || null);
                    setBrandStoryImage(hp.brandStoryImage || null);
                    setCampaignImage(hp.campaignImage || null);
                    setAboutImage(hp.aboutImage || null);
                    setSelectedFeaturedProducts(
                        (hp.selectedFeaturedProducts || []).map((p) => p._id || p)
                    );
                }
            } catch {
                setError('Failed to load homepage data.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [reset]);

    const toggleFeaturedProduct = (productId) => {
        setSelectedFeaturedProducts((prev) =>
            prev.includes(productId) ? prev.filter((p) => p !== productId) : [...prev, productId]
        );
    };

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                selectedFeaturedProducts,
                featuredCollection: data.featuredCollection || null,
            };
            if (heroMedia) payload.heroMedia = heroMedia;
            if (brandStoryImage) payload.brandStoryImage = brandStoryImage;
            if (campaignImage) payload.campaignImage = campaignImage;
            if (aboutImage) payload.aboutImage = aboutImage;
            await homepageService.update(payload);
            toast({ message: 'Homepage content saved successfully', type: 'success' });
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Save failed', type: 'error' });
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
    if (error) return <ErrorState title="Error" description={error} onRetry={() => window.location.reload()} />;

    return (
        <div>
            <PageHeader title="Homepage" description="Manage all content displayed on the storefront homepage" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-3xl">

                <FormSection title="Hero Section" description="The main banner displayed at the top of the homepage">
                    <div className="space-y-4">
                        <MediaUploader label="Hero Media (Image or Video)" value={heroMedia} onChange={setHeroMedia} acceptVideo />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Heading</label>
                            <Input placeholder="e.g. New Collection Has Arrived" {...register('heroHeading')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Subtitle</label>
                            <Textarea placeholder="A short subtitle..." rows={2} {...register('heroSubtitle')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA Button Text</label>
                            <Input placeholder="e.g. Shop Now" {...register('heroCTA')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA Link</label>
                            <Input placeholder="e.g. /collections/summer-2026 or https://..." {...register('heroCTALink')} />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Brand Story" description="The brand identity section">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Statement</label>
                            <Textarea placeholder="One-liner brand statement..." rows={2} {...register('brandStatement')} />
                        </div>
                        <MediaUploader label="Brand Story Image" value={brandStoryImage} onChange={setBrandStoryImage} />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Story Heading</label>
                            <Input placeholder="Our Story" {...register('brandStoryHeading')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Story Text</label>
                            <Textarea placeholder="Tell your story..." rows={4} {...register('brandStoryText')} />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Campaign Section" description="Promotional campaign banner">
                    <div className="space-y-4">
                        <MediaUploader label="Campaign Image" value={campaignImage} onChange={setCampaignImage} />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Campaign Heading</label>
                            <Input placeholder="Summer Sale 2026" {...register('campaignHeading')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Campaign Subtitle</label>
                            <Input placeholder="Up to 40% off selected styles" {...register('campaignSubtitle')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Campaign CTA</label>
                            <Input placeholder="Explore Collection" {...register('campaignCTA')} />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Featured Collection" description="Highlight a specific collection on the homepage">
                    <Select {...register('featuredCollection')}>
                        <option value="">None (no featured collection)</option>
                        {collections.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </Select>
                </FormSection>

                <FormSection title="Selected Featured Products" description="Hand-pick up to 8 products to highlight">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {allProducts.map((p) => (
                            <label key={p._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedFeaturedProducts.includes(p._id)}
                                    onChange={() => toggleFeaturedProduct(p._id)}
                                    className="h-4 w-4 rounded accent-black"
                                />
                                {p.images?.[0]?.url && (
                                    <img src={p.images[0].url} alt={p.name} className="h-8 w-8 rounded object-cover bg-gray-100 flex-shrink-0" />
                                )}
                                <span className="text-sm text-gray-700">{p.name}</span>
                                <span className="text-xs text-gray-400 ml-auto">{p.productCode}</span>
                            </label>
                        ))}
                        {allProducts.length === 0 && <p className="text-xs text-gray-400">No products available.</p>}
                    </div>
                    {selectedFeaturedProducts.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">{selectedFeaturedProducts.length} product{selectedFeaturedProducts.length !== 1 ? 's' : ''} selected</p>
                    )}
                </FormSection>

                <FormSection title="About OXXY" description="Displayed in the about section">
                    <div className="space-y-4">
                        <MediaUploader label="About Image" value={aboutImage} onChange={setAboutImage} />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">About Text</label>
                            <Textarea placeholder="About OXXY..." rows={4} {...register('aboutText')} />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="WhatsApp CTA" description="The section encouraging customers to enquire via WhatsApp">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp CTA Heading</label>
                            <Input placeholder="Ready to Order? Chat With Us" {...register('whatsappCTAHeading')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp CTA Text</label>
                            <Textarea placeholder="Reach us directly on WhatsApp..." rows={2} {...register('whatsappCTAText')} />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Homepage SEO">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Title</label>
                            <Input placeholder="OXXY — Premium Women's Fashion" {...register('seoTitle')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Description</label>
                            <Textarea placeholder="Discover the latest women's fashion collections..." rows={2} {...register('seoDescription')} />
                        </div>
                    </div>
                </FormSection>

                <Button type="submit" isLoading={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />Save Homepage Content
                </Button>
            </form>
        </div>
    );
};

export default HomepageCMSPage;