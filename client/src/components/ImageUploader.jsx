import { useState, useCallback, useRef } from 'react';
import { UploadCloud, X, Loader, GripVertical, ImageIcon } from 'lucide-react';
import { imageService } from '../services/apiServices';
import { useToast } from './ui/Toast';
import { Button, Input } from './ui';

const ImageCard = ({ img, index, onRemove, onAltChange, onMoveUp, onMoveDown, isFirst, isLast }) => (
    <div className="relative flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
        <div className="flex flex-col gap-1 self-start pt-1">
            <button
                type="button"
                onClick={onMoveUp}
                disabled={isFirst}
                className="text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Move up"
            >
                ▲
            </button>
            <button
                type="button"
                onClick={onMoveDown}
                disabled={isLast}
                className="text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Move down"
            >
                ▼
            </button>
        </div>
        <img
            src={img.url}
            alt={img.altText || 'Product image'}
            className="h-20 w-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
        />
        <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs text-gray-400 font-mono truncate">{img.publicId}</p>
            <Input
                placeholder="Alt text (e.g. Red floral dress front view)"
                value={img.altText || ''}
                onChange={(e) => onAltChange(index, e.target.value)}
                className="text-xs h-8"
            />
            {index === 0 && (
                <span className="inline-flex items-center text-xs font-medium bg-black text-white px-2 py-0.5 rounded-full">
                    Cover Image
                </span>
            )}
        </div>
        <button
            type="button"
            onClick={() => onRemove(index)}
            className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors"
            aria-label="Remove image"
        >
            <X className="h-4 w-4" />
        </button>
    </div>
);

const ImageUploader = ({ images, onChange }) => {
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFiles = useCallback(async (files) => {
        if (!files || files.length === 0) return;

        const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
        if (validFiles.length === 0) {
            toast({ message: 'Please select image files only.', type: 'error' });
            return;
        }

        setUploading(true);
        try {
            const uploadResults = await Promise.all(
                validFiles.map(async (file, idx) => {
                    const formData = new FormData();
                    formData.append('image', file);
                    const res = await imageService.upload(formData);
                    return {
                        url: res.data.data.url,
                        publicId: res.data.data.publicId,
                        width: res.data.data.width,
                        height: res.data.data.height,
                        altText: '',
                        displayOrder: images.length + idx,
                    };
                })
            );
            onChange([...images, ...uploadResults]);
            toast({ message: `${uploadResults.length} image(s) uploaded`, type: 'success' });
        } catch (err) {
            toast({ message: err?.response?.data?.message || 'Image upload failed', type: 'error' });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [images, onChange, toast]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleDragOver = (e) => e.preventDefault();

    const handleRemove = (index) => {
        // Note: We do NOT call Cloudinary delete here on remove from form.
        // Images are only permanently deleted from Cloudinary when a product is permanently deleted.
        const updated = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, displayOrder: i }));
        onChange(updated);
    };

    const handleAltChange = (index, altText) => {
        const updated = images.map((img, i) => i === index ? { ...img, altText } : img);
        onChange(updated);
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const updated = [...images];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        onChange(updated.map((img, i) => ({ ...img, displayOrder: i })));
    };

    const handleMoveDown = (index) => {
        if (index === images.length - 1) return;
        const updated = [...images];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        onChange(updated.map((img, i) => ({ ...img, displayOrder: i })));
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                role="button"
                aria-label="Upload images"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleFiles(e.target.files)}
                />
                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader className="h-8 w-8 animate-spin text-gray-400" />
                        <p className="text-sm text-gray-500">Uploading to Cloudinary...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <UploadCloud className="h-8 w-8 text-gray-300" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
                            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP — Max 5MB each</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Image List */}
            {images.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {images.length} image{images.length !== 1 ? 's' : ''} — first image is the cover
                    </p>
                    {images.map((img, index) => (
                        <ImageCard
                            key={img.publicId || index}
                            img={img}
                            index={index}
                            onRemove={handleRemove}
                            onAltChange={handleAltChange}
                            onMoveUp={() => handleMoveUp(index)}
                            onMoveDown={() => handleMoveDown(index)}
                            isFirst={index === 0}
                            isLast={index === images.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
