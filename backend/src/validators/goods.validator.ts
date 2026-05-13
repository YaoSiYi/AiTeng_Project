import Joi from 'joi';

export const createGoodsSchema = Joi.object({
  goodsName: Joi.string().min(1).max(200).required().messages({
    'string.min': '商品名称不能为空',
    'string.max': '商品名称最多200个字符',
    'any.required': '商品名称不能为空',
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    'number.base': '分类ID必须是数字',
    'any.required': '分类不能为空',
  }),
  goodsSn: Joi.string().max(60).required().messages({
    'string.max': '商品编号最多60个字符',
    'any.required': '商品编号不能为空',
  }),
  brandId: Joi.number().integer().min(0).default(0),
  shopPrice: Joi.number().precision(2).min(0).required().messages({
    'number.min': '销售价格不能为负数',
    'any.required': '销售价格不能为空',
  }),
  marketPrice: Joi.number().precision(2).min(0).required(),
  costPrice: Joi.number().precision(2).min(0).required(),
  storeCount: Joi.number().integer().min(0).default(0),
  goodsContent: Joi.string().allow('', null),
  originalImg: Joi.string().allow('', null),
  isOnSale: Joi.number().valid(0, 1).default(1),
  isBest: Joi.number().valid(0, 1).default(0),
  isNew: Joi.number().valid(0, 1).default(0),
  isHot: Joi.number().valid(0, 1).default(0),
  keywords: Joi.string().allow('', null),
  goodsRemark: Joi.string().allow('', null),
  sortOrder: Joi.number().integer().min(0).default(50),
});

export const updateGoodsSchema = createGoodsSchema.fork(
  ['goodsName', 'categoryId', 'goodsSn', 'shopPrice', 'marketPrice', 'costPrice'],
  (schema) => schema.optional()
);

export const updateOnSaleSchema = Joi.object({
  isOnSale: Joi.number().valid(0, 1).required().messages({
    'number.base': 'isOnSale必须是数字',
    'any.only': 'isOnSale只能是0或1',
    'any.required': 'isOnSale不能为空',
  }),
});
