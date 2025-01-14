const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const joi = require("joi");
const { buildResponse } = require("../utils/response_util");
const { param } = require("../routes/badges");
const { parse } = require("dotenv");

const create = async (req, res) => {
  const schemaProduct = joi.object({
    category_id: joi.number().integer().positive().required().messages({
      "number.base": "category ID must be a number",
      "number.integer": "category ID must be an integer",
      "number.positive": "category ID must be a positive number",
      "any.required": "category ID is required",
    }),
    product_name: joi.string().trim().min(3).max(100).required().messages({
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least {#limit} characters long",
      "string.max": "Product name cannot be longer than {#limit} characters",
    }),
    link_referral: joi.string().trim().uri().required().messages({
      "string.empty": "Link referral is required",
      "string.uri": "Link referral must be a valid URL",
    }),
  });

  const { error } = schemaProduct.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(buildResponse(false, error.details[0].message, null));
  }

  try {
    const { product_name, link_referral, category_id } = req.body;
    const categoryExist = await prisma.category.findUnique({
      where: { category_id: category_id },
    });

    if (!categoryExist) {
      return res
        .status(404)
        .json(buildResponse(false, "category_id not found", null));
    }
    const savedProduct = await prisma.product.create({
      data: {
        product_name: product_name,
        link_referral: link_referral,
        category_id: category_id,
      },
    });

    return res
      .status(200)
      .json(buildResponse(true, "product  successfully created", savedProduct));
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};

const getAllByCategory = async (req, res) => {
  try {
    const category_id = parseInt(req.params.category_id);
    const products = await prisma.product.findMany({
      where: {
        category_id: category_id,
      },
      select: {
        product_id: true,
        product_name: true,
        link_referral: true,
      },
      orderBy: { product_id: "desc" },
    });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json(buildResponse(false, "No products available", null));
    }

    return res
      .status(200)
      .json(buildResponse(true, "Successfully display all product", products));
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};

const getById = async (req, res) => {
  try {
    const product_id = parseInt(req.params.product_id);
    if (isNaN(product_id) || product_id <= 0) {
      return res
        .status(400)
        .json(buildResponse(false, "Invalid product ID", null));
    }

    const product = await prisma.product.findUnique({
      where: { product_id: product_id },
      select: {
        product_id: true,
        product_name: true,
        link_referral: true,
      },
    });

    if (!product) {
      return res
        .status(404)
        .json(buildResponse(false, "product id not found", null));
    }

    return res
      .status(200)
      .json(buildResponse(true, "Successfully display product", product));
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};

const update = async (req, res) => {
  const schemaProduct = joi.object({
    product_name: joi.string().min(3).optional().messages({
      "string empty": "product name cannot be empty",
      "string min": "product name must be at least {#limit} characters long",
    }),
    link_referral: joi.string().min(3).optional().messages({
      "string empty": "link referral cannot be empty",
      "string min": "link referral must be at least {#limit} characters long",
    }),
  });
  //console.log(req.body);
  const { error } = schemaProduct.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(buildResponse(false, error.details[0].message, null));
  }
  try {
    const product = await prisma.product.findUnique({
      where: {
        product_id: parseInt(req.params.product_id),
      },
    });

    if (!product) {
      return res
        .status(404)
        .json(buildResponse(false, "Product id not found", null));
    }

    const { product_name, link_referral } = req.body;

    const updateProduct = await prisma.product.update({
      where: {
        product_id: parseInt(req.params.product_id),
      },
      data: {
        product_name: product_name,
        link_referral: link_referral,
      },
    });

    return res
      .status(200)
      .json(buildResponse(true, "successfully update product ", updateProduct));
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};

const remove = async (req, res) => {
  try {
    const product_id = parseInt(req.params.product_id);

    const product = await prisma.product.findUnique({
      where: {
        product_id: product_id,
      },
    });

    if (!product) {
      return res
        .status(404)
        .json(buildResponse(false, "invalid product_id", null));
    }

    await prisma.product.delete({
      where: {
        product_id: product_id,
      },
    });

    return res
      .status(200)
      .json(buildResponse(true, "successfully delete product", null));
  } catch (error) {
    return res
      .status(400)
      .json(buildResponse(false, "failed delete product", null));
  }
};

module.exports = {
  create,
  update,
  getAllByCategory,
  getById,
  remove,
};
