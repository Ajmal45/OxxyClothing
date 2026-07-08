import joi from 'joi';

export const createCategorySchema = joi.object({
    name: joi.string().required().trim(),
    description: joi.string().allow('', null).trim(),
    isActive: joi.boolean().default(true),
    displayOrder: joi.number().integer().min(0).default(0),
    image: joi.object({
        url: joi.string().uri().required(),
        publicId: joi.string().required()
    }).optional()
});

export const updateCategorySchema = joi.object({
    name: joi.string().trim(),
    description: joi.string().allow('', null).trim(),
    isActive: joi.boolean(),
    displayOrder: joi.number().integer().min(0),
    image: joi.object({
        url: joi.string().uri().required(),
        publicId: joi.string().required()
    }).optional()
}).min(1);
