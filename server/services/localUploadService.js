import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadImageLocally = async (fileBuffer, originalName) => {
    const ext = path.extname(originalName) || '.png';
    const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(filePath, fileBuffer);
    return {
        url: `/uploads/${filename}`,
        publicId: filename,
    };
};

export const deleteImageLocally = (publicId) => {
    const filePath = path.join(UPLOAD_DIR, publicId);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
