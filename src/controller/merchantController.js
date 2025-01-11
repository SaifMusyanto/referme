const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const joi = require("joi");
const { builrdResponse } = require("../utils/response_util");

const create = async (req, res) => {
  const schemaMerchant = joi.object({
    merchant_name: joi.string().min(5).max(50).required().messages({
      "string.base": "Merchant name is cannot be empty",
      "string.min": "Merchant name must be atleast {#limit} characters long",
      "any.required": "Merchant name is required",
    }),
    deskripsi_merchant: joi.string().min(10).max(200).required.messages({
      "string.base": "Merchant description is cannot be empty",
      "string.min":
        "Merchant description must be atleast {#limit} characters long",
      "any.required": "Merchant description is required",
    }),
    badge_id: joi.number.min(1).messages({
      "number.base": "Must be a number",
      "number.min": "Must be at least {#limit}",
      "number.integer": "Must be an integer",
      "any.required": "badge id is required",
    }),
    profil_image: joi.string
  });
};
