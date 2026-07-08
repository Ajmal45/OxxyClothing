import joi from 'joi';

const mediaSchema = joi.object({
    url: joi.string().required(),
    publicId: joi.string().required(),
    type: joi.string().valid('image', 'video').default('image')
});

const imageSchema = joi.object({
    url: joi.string().required(),
    publicId: joi.string().required()
});

export const updateHomepageSchema = joi.object({
    heroHeading: joi.string().allow('', null).trim(),
    heroSubtitle: joi.string().allow('', null).trim(),
    heroCTA: joi.string().allow('', null).trim(),
    heroCTALink: joi.string().allow('', null).trim(),
    heroMedia: mediaSchema.optional(),
    brandStatement: joi.string().allow('', null).trim(),
    brandStoryImage: imageSchema.optional(),
    brandStoryHeading: joi.string().allow('', null).trim(),
    brandStoryText: joi.string().allow('', null).trim(),
    campaignImage: imageSchema.optional(),
    campaignHeading: joi.string().allow('', null).trim(),
    campaignSubtitle: joi.string().allow('', null).trim(),
    campaignCTA: joi.string().allow('', null).trim(),
    featuredCollection: joi.string().hex().length(24).allow(null),
    selectedFeaturedProducts: joi.array().items(joi.string().hex().length(24)).optional(),
    aboutText: joi.string().allow('', null).trim(),
    aboutImage: imageSchema.optional(),
    whatsappCTAHeading: joi.string().allow('', null).trim(),
    whatsappCTAText: joi.string().allow('', null).trim(),
    seoTitle: joi.string().allow('', null).trim(),
    seoDescription: joi.string().allow('', null).trim()
});
