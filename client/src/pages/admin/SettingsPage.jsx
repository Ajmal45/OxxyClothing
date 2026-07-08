import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus, Trash2, Globe } from 'lucide-react';
import { settingsService } from '../../services/apiServices';
import {
    Button, Input, Textarea, PageHeader, FormSection, Spinner, ErrorState, useToast
} from '../../components/ui';

const whatsappRegex = /^\+[1-9]\d{1,14}$/;

const settingsSchema = z.object({
    whatsappNumber: z.string().min(1, 'WhatsApp number is required').regex(whatsappRegex, 'Must be in international format (e.g. +919876543210)'),
    instagramUrl: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
    storeEmail: z.string().email('Enter a valid email').or(z.literal('')).optional(),
    storePhone: z.string().optional(),
    storeAddress: z.string().optional(),
    defaultSEO: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        keywords: z.string().optional(),
    }).optional(),
});

const SettingsPage = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [socialLinks, setSocialLinks] = useState([]);
    const [settingsId, setSettingsId] = useState(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: { whatsappNumber: '', instagramUrl: '', storeEmail: '', storePhone: '', storeAddress: '', defaultSEO: { title: '', description: '', keywords: '' } }
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await settingsService.get();
                const s = res.data.data;
                if (s && s._id) {
                    setSettingsId(s._id);
                    setSocialLinks(s.socialLinks || []);
                    reset({
                        whatsappNumber: s.whatsappNumber || '',
                        instagramUrl: s.instagramUrl || '',
                        storeEmail: s.storeEmail || '',
                        storePhone: s.storePhone || '',
                        storeAddress: s.storeAddress || '',
                        defaultSEO: {
                            title: s.defaultSEO?.title || '',
                            description: s.defaultSEO?.description || '',
                            keywords: s.defaultSEO?.keywords || '',
                        }
                    });
                }
            } catch {
                setError('Failed to load settings.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [reset]);

    const handleAddSocialLink = () => {
        setSocialLinks((prev) => [...prev, { platform: '', url: '' }]);
    };

    const handleRemoveSocialLink = (index) => {
        setSocialLinks((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSocialLinkChange = (index, field, value) => {
        setSocialLinks((prev) => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
    };

    const onSubmit = async (data) => {
        try {
            await settingsService.update({ ...data, socialLinks });
            toast({ message: 'Settings saved successfully', type: 'success' });
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Save failed', type: 'error' });
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
    if (error) return <ErrorState title="Error" description={error} onRetry={() => window.location.reload()} />;

    return (
        <div>
            <PageHeader title="Settings" description="Manage store contact details and global configuration" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
                <FormSection title="Contact & WhatsApp" description="Core store contact information">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                WhatsApp Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="+919876543210 (include country code)"
                                error={errors.whatsappNumber?.message}
                                {...register('whatsappNumber')}
                            />
                            <p className="mt-1 text-xs text-gray-400">Used for the enquiry button. Include country code without spaces.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Email</label>
                            <Input type="email" placeholder="contact@oxxy.com" error={errors.storeEmail?.message} {...register('storeEmail')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Phone</label>
                            <Input placeholder="+91 98765 43210" {...register('storePhone')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Address</label>
                            <Textarea placeholder="Full store address..." rows={2} {...register('storeAddress')} />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Social Media">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram URL</label>
                            <Input placeholder="https://instagram.com/oxxy" error={errors.instagramUrl?.message} {...register('instagramUrl')} />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Additional Social Links</label>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddSocialLink}>
                                    <Plus className="h-3.5 w-3.5 mr-1" />Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {socialLinks.map((link, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <Input
                                            placeholder="Platform (e.g. Facebook)"
                                            value={link.platform}
                                            onChange={(e) => handleSocialLinkChange(i, 'platform', e.target.value)}
                                            className="w-32"
                                        />
                                        <Input
                                            placeholder="URL"
                                            value={link.url}
                                            onChange={(e) => handleSocialLinkChange(i, 'url', e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSocialLink(i)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                                {socialLinks.length === 0 && <p className="text-xs text-gray-400">No extra social links added.</p>}
                            </div>
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Default SEO" description="Used on pages without specific SEO settings">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Title</label>
                            <Input placeholder="OXXY — Complete Women Store" {...register('defaultSEO.title')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Description</label>
                            <Textarea placeholder="Premium women's fashion..." rows={2} {...register('defaultSEO.description')} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Keywords</label>
                            <Input placeholder="women fashion, dresses, kurta, oxxy" {...register('defaultSEO.keywords')} />
                        </div>
                    </div>
                </FormSection>

                <Button type="submit" isLoading={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />Save Settings
                </Button>
            </form>
        </div>
    );
};

export default SettingsPage;
