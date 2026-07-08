import express from 'express';
import {
    getAdminProducts,
    getAdminProductById,
    createProduct,
    updateProduct,
    softDeleteProduct,
    restoreProduct,
    permanentDeleteProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { uploadImageToCloudinary } from '../services/cloudinaryService.js';
import { uploadImageLocally } from '../services/localUploadService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAdminProducts)
    .post(validateRequest(createProductSchema), createProduct);

// Custom endpoint for image upload since we handle binary separately from JSON metadata
router.post('/upload-image', upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'No image file provided');
    }

    const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';
    const result = useCloudinary
        ? await uploadImageToCloudinary(req.file.buffer)
        : await uploadImageLocally(req.file.buffer, req.file.originalname);
    res.status(200).json(new ApiResponse(200, result, 'Image uploaded successfully'));
}));

router.route('/:id')
    .get(getAdminProductById)
    .put(validateRequest(updateProductSchema), updateProduct)
    .delete(softDeleteProduct);

router.patch('/:id/restore', restoreProduct);
router.delete('/:id/permanent', permanentDeleteProduct);

export default router;
