import { cloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import fs from 'fs';
import { promisify } from 'util';

// Promisify stream to buffer if needed, though we will use buffer directly
export const uploadImageToCloudinary = async (fileBuffer, folderName = 'oxxy/products') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folderName,
                resource_type: 'image',
                // Auto optimize quality and format
                fetch_format: 'auto',
                quality: 'auto'
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    reject(new ApiError(500, 'Image upload failed'));
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                        width: result.width,
                        height: result.height
                    });
                }
            }
        );

        // Pipe buffer to stream
        uploadStream.end(fileBuffer);
    });
};

export const deleteImageFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
        // We log but don't throw here to avoid failing a larger transaction 
        // (like deleting a product) just because an image cleanup failed.
    }
};
