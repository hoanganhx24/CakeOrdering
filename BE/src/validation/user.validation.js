const Joi = require('joi');

const userValid = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Tên không được để trống',
        'any.required': 'Tên là bắt buộc'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
        'any.required': 'Email là bắt buộc'
    }),
    username: Joi.string().required().messages({
        'string.empty': 'Tên đăng nhập không được để trống',
        'any.required': 'Tên đăng nhập là bắt buộc'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Mật khẩu không được để trống',
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'any.required': 'Mật khẩu là bắt buộc'
    })
});

const updateUserValid = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Tên không được để trống',
        'any.required': 'Tên là bắt buộc'
    })
});

module.exports = {userValid, updateUserValid};