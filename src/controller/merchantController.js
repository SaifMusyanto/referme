/*
model Merchant {
  merchant_id           Int        @id @default(autoincrement())
  user_id               Int        @unique
  merchant_name         String     @unique @db.VarChar(100)
  badge_id              Int?
  deskripsi_merchant    String?    @db.Text
  profil_image          String?    @db.VarChar(255)
  banner_image          String?    @db.VarChar(255)
  current_product_total Int        @default(0)
  max_product           Int        @default(50)
  created_at            DateTime   @default(now())
  user                  User       @relation(fields: [user_id], references: [user_id])
  badge                 Badge?     @relation(fields: [badge_id], references: [badge_id])
  categories            Category[]
}
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const joi = require("joi");
const { buildResponse } = require("../utils/response_util");
const { get } = require("../routes/badges");

const create = async (req, res) => {
  const schemaMerchant = joi.object({
    merchant_name: joi.string().min(5).max(50).required().messages({
      "string.base": "Merchant name is cannot be empty",
      "string.min": "Merchant name must be atleast {#limit} characters long",
      "any.required": "Merchant name is required",
    }),
    deskripsi_merchant: joi.string().min(10).max(200).required().messages({
      "string.base": "Merchant description is cannot be empty",
      "string.min":
        "Merchant description must be atleast {#limit} characters long",
      "any.required": "Merchant description is required",
    }),
    badge_id: joi.number().min(1).messages({
      "number.base": "Must be a number",
      "number.min": "Must be at least {#limit}",
      "number.integer": "Must be an integer",
      "any.required": "badge id is required",
    }),
    profil_image: joi.string().min(3).required().messages({
      "string empty": "profil image is required",
      "string min": "profil image must be at least {#limit} characters long",
    }),
    banner_image: joi.string().min(3).required().messages({
      "string empty": "banner image is required",
      "string min": "banner image must be at least {#limit} characters long",
    }),
  });

  const { error } = schemaMerchant.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json(buildResponse(false, error.details[0].message, null));
  }

  try {
    const { user_id } = req.params;
    if (!user_id || isNaN(user_id)) {
      return res
        .status(400)
        .json(buildResponse(false, "User ID must be a valid number", null));
    }

    const userExists = await prisma.user.findUnique({
      where: { user_id: parseInt(user_id) }, // Konversi ke integer jika perlu
    });

    if (!userExists) {
      return res
        .status(404)
        .json(buildResponse(false, "User ID not found", null));
    }

    const {
      merchant_name,
      deskripsi_merchant,
      badge_id,
      profil_image,
      banner_image,
      current_product_total,
      max_product,
    } = req.body;

    const savedMerchant = await prisma.merchant.create({
      data: {
        merchant_name: merchant_name,
        deskripsi_merchant: deskripsi_merchant,
        profil_image: profil_image,
        banner_image: banner_image,
        current_product_total: 0,
        max_product: 100,
        user: {
          connect: { user_id: parseInt(user_id) },
        },
        badge: {
          connect: {
            badge_id: badge_id,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        buildResponse(true, "merchant successfully created", savedMerchant)
      );
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};

const update = async (req, res) => {
  const schemaMerchant = joi.object({
    merchant_name: joi.string().min(5).max(50).optional().messages({
      "string.base": "Merchant name cannot be empty",
      "string.min": "Merchant name must be atleast {#limit} characters long",
    }),
    deskripsi_merchant: joi.string().min(10).max(200).optional().messages({
      "string.base": "Merchant description cannot be empty",
      "string.min":
        "Merchant description must be atleast {#limit} characters long",
    }),
    badge_id: joi.number().min(1).messages({
      "number.base": "Must be a number",
      "number.min": "Must be at least {#limit}",
      "number.integer": "Must be an integer",
    }),
    profil_image: joi.string().min(3).optional().messages({
      "string empty": "profil image cannot be empty",
      "string min": "profil image must be at least {#limit} characters long",
    }),
    banner_image: joi.string().min(3).optional().messages({
      "string empty": "banner image cannot be empty",
      "string min": "banner image must be at least {#limit} characters long",
    }),
  });

  const { error } = schemaMerchant.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json(buildResponse(false, error.details[0].message, null));
  }

  try {
    const { merchant_id } = req.params;
    if (!merchant_id || isNaN(merchant_id)) {
      return res
        .status(400)
        .json(buildResponse(false, "Merchant ID must be a valid number", null));
    }

    const merchantExist = await prisma.merchant.findUnique({
      where: { merchant_id: parseInt(merchant_id) }, // Konversi ke integer jika perlu
    });

    if (!merchantExist) {
      return res
        .status(404)
        .json(buildResponse(false, "merchant ID not found", null));
    }

    const { merchant_name, deskripsi_merchant, profil_image, banner_image } =
      req.body;

    const updatedMerchant = await prisma.merchant.update({
      where: {
        merchant_id: parseInt(req.params.merchant_id),
      },
      data: {
        merchant_name: merchant_name,
        deskripsi_merchant: deskripsi_merchant,
        profil_image: profil_image,
        banner_image: banner_image,
      },
    });

    return res
      .status(200)
      .json(
        buildResponse(true, "merchant successfully created", updatedMerchant)
      );
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};

const getById = async (req, res) => {
  try {
    const merchant_id = parseInt(req.params.merchant_id);

    if (!merchant_id || isNaN(merchant_id)) {
      return res
        .status(400)
        .json(buildResponse(false, "Merchant ID must be a valid number", null));
    }

    const merchant = await prisma.merchant.findUnique({
      where: { merchant_id },
      include: {
        categories: {
          include: {
            products: true,
          },
        },
      },
    });

    // Hitung total produk
    const totalProducts = merchant.categories.reduce((count, category) => {
      return count + category.products.length;
    }, 0);

    const merchantData = {
      merchant_name: merchant.merchant_name,
      deskripsi_merchant: merchant.deskripsi_merchant,
      profil_image: merchant.profil_image,
      banner_image: merchant.banner_image,
      total_products: totalProducts,
      categories: merchant.categories.map((category) => ({
        category_name: category.category_name,
        total_products: category.products.length,
      })),
    };

    return res
      .status(200)
      .json(buildResponse(true, "Successfully display merchant", merchantData));
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};

const getAll = async (req, res) => {
  try {
    const merchants = await prisma.merchant.findMany({
      include: {
        categories: {
          include: {
            products: true,
          },
        },
      },
    });

    const merchantData = merchants.map((merchant) => {
      // Hitung total produk untuk merchant ini
      const totalProducts = merchant.categories.reduce((count, category) => {
        return count + category.products.length;
      }, 0);

      return {
        merchant_id: merchant.merchant_id,
        merchant_name: merchant.merchant_name,
        deskripsi_merchant: merchant.deskripsi_merchant,
        profil_image: merchant.profil_image,
        banner_image: merchant.banner_image,
        total_products: totalProducts,
        // categories: merchant.categories.map((category) => ({
        //   category_name: category.category_name,
        //   total_products: category.products.length,
        // })),
      };
    });

    return res
      .status(200)
      .json(buildResponse(true, "Successfully display merchant", merchantData));
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};

const remove = async (req, res) => {
  try {
    const merchant_id = parseInt(req.params.merchant_id);

    if (isNaN(merchant_id) || merchant_id <= 0) {
      return res
        .status(400)
        .json(buildResponse(false, "invalid merchant id", null));
    }

    const categoryExist = await prisma.merchant.findUnique({
      where: {
        merchant_id,
      },
    });

    if (!categoryExist) {
      return res
        .status(400)
        .json(buildResponse(false, "merchant id not found", null));
    }

    await prisma.merchant.delete({
      where: {
        merchant_id: merchant_id,
      },
    });

    return res
      .status(200)
      .json(buildResponse(true, "Succesfully delete merchant", null));
  } catch (error) {
    return res.status(400).json(buildResponse(false, error.message, null));
  }
};

module.exports = {
  create,
  update,
  getById,
  getAll,
  remove,
};
