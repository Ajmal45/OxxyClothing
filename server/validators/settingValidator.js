import joi from 'joi';

const socialLinkSchema = joi.object({
    platform: joi.string().required(),
    url: joi.string().uri().required()
});

export const updateSettingSchema = joi.object({
    whatsappNumber: joi.string().required(),
    instagramUrl: joi.string().uri().allow('', null),
    storeEmail: joi.string().email().allow('', null),
    storePhone: joi.string().allow('', null),
    storeAddress: joi.string().allow('', null),
    socialLinks: joi.array().items(socialLinkSchema).optional(),
    defaultSEO: joi.object({
        title: joi.string().allow('', null),
        description: joi.string().allow('', null),
        keywords: joi.string().allow('', null)
    }).optional()
});
