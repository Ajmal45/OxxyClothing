import joi from 'joi';

export const createCollectionSchema = joi.object({
    name: joi.string().required().trim(),
    description: joi.string().allow('', null).trim(),
    isFeatured: joi.boolean().default(false),
    isActive: joi.boolean().default(true),
    displayOrder: joi.number().integer().min(0).default(0),
    seoTitle: joi.string().allow('', null).trim(),
    seoDescription: joi.string().allow('', null).trim(),
    coverImage: joi.object({
        url: joi.string().uri().required(),
        publicId: joi.string().required(),
        altText: joi.string().allow('', null)
    }).optional()
});

export const updateCollectionSchema = joi.object({
    name: joi.string().trim(),
    description: joi.string().allow('', null).trim(),
    isFeatured: joi.boolean(),
    isActive: joi.boolean(),
    displayOrder: joi.number().integer().min(0),
    seoTitle: joi.string().allow('', null).trim(),
    seoDescription: joi.string().allow('', null).trim(),
    coverImage: joi.object({
        url: joi.string().uri().required(),
        publicId: joi.string().required(),
        altText: joi.string().allow('', null)
    }).optional()
}).min(1);
