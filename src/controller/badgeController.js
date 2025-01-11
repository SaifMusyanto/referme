const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const joi = require("joi");
const { buildResponse } = require("../utils/response_util");

const create = async (req, res) => {
  const schemaBadge = joi.object({
    badge_name: joi.string().required().messages({
      "string.empty": "Badge name is required",
    }),
  });

  const { error } = schemaBadge.validate(req.body);
  if (error) {
    // console.log("Validation error:", error.details);
    return res
      .status(400)
      .json(buildResponse(false, error.details[0].message, null));
  }

  try {
    const { badge_name } = req.body;
    const SavedBadge = await prisma.badge.create({
      data: { badge_name: badge_name },
    });

    return res
      .status(200)
      .json(buildResponse(true, "Badge successfully created", SavedBadge));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

const getAll = async (req, res) => {
  try {
    const badge = await prisma.badge.findMany({
      select: {
        badge_id: true,
        badge_name: true,
      },
      orderBy: { badge_id: "asc" },
    });
    return res
      .status(200)
      .json(buildResponse(true, "successfully display badges", badge));
  } catch (error) {
    console.error("Database error:", error);
    return res
      .status(500)
      .json(buildResponse(false, "failed display badges", null));
  }
};

const update = async (req, res) => {
  //   console.log("Raw Request Body:", req.body);
  const schemaBadge = joi.object({
    badge_name: joi.string().required().messages({
      "string.empty": "Badge name is required",
    }),
  });

  const { error } = schemaBadge.validate(req.body);
  if (error) {
    console.log("Validation error:", error.details);
    return res
      .status(400)
      .json(buildResponse(false, error.details[0].message, null));
  }

  try {
    const badge = await prisma.badge.findUnique({
      where: {
        badge_id: parseInt(req.params.badge_id),
      },
    });

    if (!badge) {
      return res
        .status(404)
        .json(buildResponse(false, "badge id not found", null));
    }

    const data = req.body;

    const updateBadge = await prisma.badge.update({
      where: {
        badge_id: parseInt(req.params.badge_id),
      },
      data: data,
    });

    return res
      .status(200)
      .json(buildResponse(true, "Succesfully update badge", updateBadge));
  } catch (error) {
    return res
      .status(500)
      .json(buildResponse(false, "failed update badge", null));
  }
};

const remove = async (req, res) => {
  try {
    const badge = await prisma.badge.findUnique({
      where: {
        badge_id: parseInt(req.params.badge_id),
      },
    });

    if (!badge) {
      return res
        .status(404)
        .json(buildResponse(false, "badge id not found", null));
    }

    await prisma.badge.delete({
      where: {
        badge_id: parseInt(req.params.badge_id),
      },
    });

    return res
      .status(200)
      .json(buildResponse(true, "Succesfully delete badge", null));
  } catch (error) {
    return res.status(500).json(buildResponse(false, error.message, null));
  }
};

module.exports = {
  create,
  getAll,
  update,
  remove,
};
