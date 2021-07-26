const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getRegionByID = async (req, res) => {
  const { id } = req.params;
  try {
    const regionData = await prisma.regions.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        countries: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (regionData) {
      return res.status(200).json({
        success: true,
        message: "Region info",
        data: regionData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const getRegions = async (req, res, next) => {
  try {
    const allRegions = await prisma.regions.findMany({
      select: {
        id: true,
        name: true,
        countries: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "All region info",
      data: allRegions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const postRegions = async (req, res) => {
  const body = req.body;
  try {
    let regionExist;
    const { name } = req.body;

    regionExist = await prisma.regions.findFirst({
      where: { name: name },
    });

    if (regionExist) {
      return res.status(400).json({
        success: false,
        error: "Region with this name already exists",
        data: {},
      });
    }

    const region = await prisma.regions.create({
      data: body,
    });

    return res.status(200).json({
      success: true,
      message: "Successful user creation",
      data: region,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const putRegionsById = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  let region;
  try {
    const regionExist = await prisma.regions.findFirst({
      where: { id: Number(id) },
    });

    // if not exists, throw error

    if (!regionExist) {
      return res.status(400).json({
        success: false,
        error: "Region Not Exists",
        data: {},
      });
    }

    region = await prisma.regions.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful user update",
      data: region,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const deleteRegionsById = async (req, res) => {
  const { id } = req.params;
  try {
    const regionExist = await prisma.regions.findFirst({
      where: { id: Number(id) },
    });

    // if not exists, throw error

    if (!regionExist) {
      return res.status(400).json({
        success: false,
        error: "Region Not Exists",
        data: {},
      });
    }

    const hasCountries = await prisma.countries.findMany({
      where: { regions_id: Number(id) },
    });

    if (hasCountries.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Delete Countries first",
        data: hasCountries,
      });
    }

    const region = await prisma.regions.delete({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful region delete",
      data: region,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

module.exports = {
  getRegions,
  postRegions,
  getRegionByID,
  putRegionsById,
  deleteRegionsById,
};
