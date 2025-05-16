const Joi = require('joi');

const productValid = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Tên sản phẩm không được để trống',
        'any.required': 'Tên sản phẩm là bắt buộc'
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Mô tả không được để trống',
        'any.required': 'Mô tả là bắt buộc'
    }),
    price: Joi.number().required().positive().messages({
        'number.base': 'Giá phải là số',
        'number.positive': 'Giá phải là số dương',
        'any.required': 'Giá là bắt buộc'
    }),
    category: Joi.string().required().messages({
        'string.empty': 'Danh mục không được để trống',
        'any.required': 'Danh mục là bắt buộc'
    })
});


module.exports = {productValid};