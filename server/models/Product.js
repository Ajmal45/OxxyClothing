import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String },
    isActive: { type: Boolean, default: true }
}, { _id: true });

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    altText: String,
    width: Number,
    height: Number,
    displayOrder: { type: Number, default: 0 }
}, { _id: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    productCode: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
    images: [imageSchema],
    variants: [variantSchema],
    isAvailable: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, { timestamps: true });

// Ensure unique size-color combinations per product
productSchema.pre('validate', function (next) {
    if (this.variants && this.variants.length > 0) {
        const uniqueVariants = new Set();
        for (const variant of this.variants) {
            const key = `${variant.size}-${variant.color}`.toLowerCase();
            if (uniqueVariants.has(key)) {
                return next(new Error(`Duplicate variant: ${variant.size} - ${variant.color}`));
            }
            uniqueVariants.add(key);
        }
    }
    next();
});

// Auto-calculate availability before saving
productSchema.pre('save', function (next) {
    if (this.variants && this.variants.length > 0) {
        this.isAvailable = this.variants.some(v => v.isActive && v.stock > 0);
    } else {
        this.isAvailable = false;
    }
    next();
});

// Indexes for search and filtering
productSchema.index({ name: 'text', description: 'text', productCode: 'text' });
productSchema.index({ category: 1, isDeleted: 1 });
productSchema.index({ collections: 1, isDeleted: 1 });
productSchema.index({ price: 1 });

export const Product = mongoose.model('Product', productSchema);
