import Joi from 'joi';

export const userListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  keyword: Joi.string().max(100).optional(),
  isDelete: Joi.number().integer().valid(0, 1).optional(),
});

export const updateUserSchema = Joi.object({
  nickname: Joi.string().max(60).optional(),
  email: Joi.string().email().max(100).optional(),
  mobile: Joi.string().pattern(/^1\d{10}$/).max(20).optional().messages({
    'string.pattern.base': '手机号格式不正确',
  }),
  sex: Joi.number().integer().valid(0, 1, 2).optional(),
  birthday: Joi.number().integer().optional(),
}).min(1).messages({
  'object.min': '至少需要提供一个更新字段',
});
