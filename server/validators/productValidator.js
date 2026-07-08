import joi from 'joi';

const variantSchema = joi.object({
    size: joi.string().required().trim(),
    color: joi.string().required().trim(),
    stock: joi.number().integer().min(0).default(0),
    sku: joi.string().allow('', null).trim(),
    isActive: joi.boolean().default(true)
});

const imageSchema = joi.object({
    url: joi.string().uri().required(),
    publicId: joi.string().required(),
    altText: joi.string().allow('', null).trim(),
    width: joi.number().integer().optional(),
    height: joi.number().integer().optional(),
    displayOrder: joi.number().integer().default(0)
});

export const createProductSchema = joi.object({
    name: joi.string().required().trim(),
    productCode: joi.string().required().trim(),
    description: joi.string().required().trim(),
    price: joi.number().min(0).required(),
    category: joi.string().hex().length(24).required(), // ObjectId
    collections: joi.array().items(joi.string().hex().length(24)).optional(),
    images: joi.array().items(imageSchema).optional(),
    variants: joi.array().items(variantSchema).optional(),
    isFeatured: joi.boolean().default(false),
    isNewArrival: joi.boolean().default(false),
    displayOrder: joi.number().integer().default(0),
    seoTitle: joi.string().allow('', null).trim(),
    seoDescription: joi.string().allow('', null).trim()
});

export const updateProductSchema = joi.object({
    name: joi.string().trim(),
    productCode: joi.string().trim(),
    description: joi.string().trim(),
    price: joi.number().min(0),
    category: joi.string().hex().length(24),
    collections: joi.array().items(joi.string().hex().length(24)),
    images: joi.array().items(imageSchema),
    variants: joi.array().items(variantSchema),
    isFeatured: joi.boolean(),
    isNewArrival: joi.boolean(),
    displayOrder: joi.number().integer(),
    seoTitle: joi.string().allow('', null).trim(),
    seoDescription: joi.string().allow('', null).trim()
}).min(1);
