import joi from 'joi';

export const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required'
    }),
    password: joi.string().required().messages({
        'any.required': 'Password is required'
    })
});
