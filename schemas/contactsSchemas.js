import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.base": `"name" повинно бути рядком`,
    "string.empty": `"name" не може бути порожнім`,
    "string.min": `"name" має містити щонайменше 2 символи`,
    "any.required": `"name" є обов'язковим`,
  }),
  email: Joi.string().email().required().messages({
    "string.email": `"email" має бути валідною адресою`,
    "any.required": `"email" є обов'язковим`,
  }),
  phone: Joi.string().pattern(/^[0-9\-\s()]+$/).required().messages({
    "string.pattern.base": `"phone" має містити лише цифри, пробіли, дужки або тире`,
    "any.required": `"phone" є обов'язковим`,
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9\-\s()]+$/),
}).min(1).messages({
  "object.min": `"Body must have at least one field"`,
});
