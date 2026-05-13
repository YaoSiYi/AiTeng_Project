import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    'string.min': '用户名至少3个字符',
    'string.max': '用户名最多50个字符',
    'any.required': '用户名不能为空',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.min': '密码至少6个字符',
    'string.max': '密码最多100个字符',
    'any.required': '密码不能为空',
  }),
});
