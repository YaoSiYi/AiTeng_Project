import Joi from 'joi';

export const orderListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  orderNo: Joi.string().max(20).optional(),
  orderStatus: Joi.number().integer().valid(0, 1, 2).optional(),
  payStatus: Joi.number().integer().valid(0, 1).optional(),
  shippingStatus: Joi.number().integer().valid(0, 1).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  keyword: Joi.string().max(100).optional(),
});

export const updateOrderStatusSchema = Joi.object({
  orderStatus: Joi.number().integer().valid(0, 1, 2).optional(),
  payStatus: Joi.number().integer().valid(0, 1).optional(),
  shippingStatus: Joi.number().integer().valid(0, 1).optional(),
  remark: Joi.string().allow('', null).max(255),
}).min(1).messages({
  'object.min': '至少需要提供一个状态字段',
});

export const shipOrderSchema = Joi.object({
  expressCode: Joi.string().max(50).required().messages({
    'string.max': '快递公司编码最多50个字符',
    'any.required': '快递公司编码不能为空',
  }),
  expressNo: Joi.string().max(50).required().messages({
    'string.max': '快递单号最多50个字符',
    'any.required': '快递单号不能为空',
  }),
  shippingName: Joi.string().max(120).required().messages({
    'string.max': '快递公司名称最多120个字符',
    'any.required': '快递公司名称不能为空',
  }),
});
