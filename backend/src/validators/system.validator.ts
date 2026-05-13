import Joi from 'joi';

export const updateConfigSchema = Joi.object()
  .pattern(Joi.string().max(100), Joi.string().max(10000))
  .min(1)
  .messages({
    'object.min': '至少需要提供一个配置项',
  });
