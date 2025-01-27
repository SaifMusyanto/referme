const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const joi = require("joi");
const { buildResponse } = require("../utils/response_util");

const create = async (req, res) => {
  const schemaCategory = joi.object({
    merchant_id: joi.number().integer().positive().required().messages({
      "number.base": "Merchant ID must be a number",
      "number.integer": "Merchant ID must be an integer",
      "number.positive": "Merchant ID must be a positive number",
      "any.required": "Merchant ID is required",
    }),
    category_name: joi.string().min(3).required().messages({
      "string.empty": "Category name is required",
      "string.min": "Category name must be at least {#limit} characters long",
    }),
    category_image: joi.string().min(3).required().messages({
      "string.empty": "Category image is required",
      "string.min": "Category image must be at least {#limit} characters long",
    }),
  });

  const { error } = schemaCategory.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(buildResponse(false, error.details[0].message, null));
  }

  try {
    const { merchant_id, category_name, category_image } = req.body;
    const merchantExist = await prisma.merchant.findUnique({
      where: {
        merchant_id: merchant_id,
      },
    });

    if (!merchantExist) {
      return res
        .status(400)
        .json(buildResponse(false, "Merchant ID is invalid", null));
    }

    const categoryExist = await prisma.category.findFirst({
      where: {
        merchant_id,
        category_name: category_name.trim(),
      },
    });

    if (categoryExist) {
      return res
        .status(409)
        .json(
          buildResponse(
            false,
            "Category name already exists for this merchant",
            null
          )
        );
    }

    // Generate slug from category_name
    const slug = category_name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^a-z0-9-]/g, ''); // Remove invalid characters

    const categorySaved = await prisma.category.create({
      data: {
        merchant_id: merchant_id,
        category_name: category_name,
        category_image: category_image,
        slug: slug, // Save the generated slug
      },
    });

    return res
      .status(200)
      .json(buildResponse(true, "Successfully created category", categorySaved));
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};


const update = async (req, res) => {
  const schemaCategory = joi
    .object({
      category_name: joi.string().trim().min(3).optional().messages({
        "string empty": "category name cannot be empty",
        "string min": "category name must be at least {#limit} characters long",
      }),
      category_image: joi.string().trim().min(3).optional().messages({
        "string empty": "category image cannot be empty",
        "string min":
          "category image must be at least {#limit} characters long",
      }),
    })
    .min(1);

  const { error } = schemaCategory.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(buildResponse(false, error.details[0].message, null));
  }

  try {
    const merchant_id = parseInt(req.params.merchant_id);
    const category_id = parseInt(req.params.category_id);

    if (isNaN(merchant_id) || merchant_id <= 0) {
      return res
        .status(400)
        .json(buildResponse(false, "Invalid merchant ID", null));
    }
    if (isNaN(category_id) || category_id <= 0) {
      return res
        .status(400)
        .json(buildResponse(false, "Invalid category ID", null));
    }

    const categoryExist = await prisma.category.findFirst({
      where: {
        category_id,
        merchant_id,
      },
    });

    if (!categoryExist) {
      return res
        .status(404)
        .json(buildResponse(false, "Category not found", null));
    }

    if (req.body.category_name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          merchant_id: categoryExist.merchant_id,
          category_name: req.body.category_name.trim(),
          NOT: { category_id: category_id }, // Ensure it is not the category being updated
        },
      });

      if (duplicateCategory) {
        return res
          .status(409)
          .json(
            buildResponse(
              false,
              "Category name already exists for this merchant",
              null
            )
          );
      }
    }

    const { category_name, category_image } = req.body;
    let slug;

    if (category_name) {
      // Generate new slug if category_name is updated
      slug = category_name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/[^a-z0-9-]/g, ''); // Remove invalid characters
    }

    const updateCategory = await prisma.category.update({
      where: {
        category_id: parseInt(req.params.category_id),
      },
      data: {
        ...(category_name && { category_name }),
        ...(category_image && { category_image }),
        ...(slug && { slug }), // Update slug if it was generated
      },
    });

    return res
      .status(200)
      .json(
        buildResponse(true, "Successfully updated category", updateCategory)
      );
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};


const getAll = async (req, res) => {
  try {
    const merchant_id = parseInt(req.params.merchant_id);

    if (!merchant_id) {
      return res
        .status(400)
        .json(buildResponse(false, "invalid merchant", null));
    }

    const categories = await prisma.category.findMany({
      where: { merchant_id },
      select: {
        category_id: true,
        category_name: true,
        category_image: true,
      },
      orderBy: { category_id: "asc" },
    });

    if (!categories || categories.length === 0) {
      return res
        .status(400)
        .json(buildResponse(false, "No category available", null));
    }

    return res
      .status(200)
      .json(buildResponse(true, "Successfully display category", categories));
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};

const getCategory = async (req, res) => {
  const slug = req.params.slug;
  console.log(slug);
  // 🔹 Validasi apakah `slug` valid
  if (!slug) {
    return res
      .status(400)
      .json(buildResponse(false, "Invalid category", null));
  }

  try {
    // 🔹 Cari kategori berdasarkan `category_id`
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {products: true},
    });

    // 🔹 Jika kategori tidak ditemukan
    if (!category) {
      return res
        .status(404)
        .json(buildResponse(false, "Category not found", null));
    }

    return res
      .status(200)
      .json(buildResponse(true, "Successfully retrieved category", category));
  } catch (error) {
    return res
      .status(500)
      .json(buildResponse(false, "Failed to retrieve category", error.message));
  }
};

const remove = async (req, res) => {
  try {
    const category_id = parseInt(req.params.category_id);

    if (isNaN(category_id) || category_id <= 0) {
      return res
        .status(400)
        .json(buildResponse(false, "invalid category id", null));
    }

    const categoryExist = await prisma.category.findFirst({
      where: {
        category_id,
      },
    });

    if (!categoryExist) {
      return res
        .status(404)
        .json(buildResponse(false, "category id not found", null));
    }

    await prisma.category.delete({
      where: {
        category_id: category_id,
      },
    });

    return res
      .status(200)
      .json(buildResponse(true, "Succesfully delete category", null));
  } catch (error) {
    return res
      .status(400)
      .json(buildResponse(false, error.message, null));
  }
};

module.exports = {
  create,
  update,
  getAll,
  getCategory,
  remove,
};
