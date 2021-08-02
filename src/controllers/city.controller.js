const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCityByID = async (req, res) => {
  const { id } = req.params;
  try {
    const cityData = await prisma.cities.findUnique({
      where: { id: Number(id) },
    });
    if (cityData) {
      return res.status(200).json({
        success: true,
        message: "City info",
        data: cityData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "City not found",
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

const getCities = async (req, res, next) => {
  try {
    const allCitys = await prisma.cities.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "All Cities",
      data: allCitys,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const putCitiesById = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  let City;
  try {
    const CityExist = await prisma.cities.findFirst({
      where: { id: Number(id) },
    });

    // if not exists, throw error

    if (!CityExist) {
      return res.status(400).json({
        success: false,
        error: "City Not Exists",
        data: {},
      });
    }

    const city = await prisma.cities.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful city update",
      data: city,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const deleteCitiesById = async (req, res) => {
  const { id } = req.params;
  try {
    const CityExist = await prisma.cities.findFirst({
      where: { id: Number(id) },
    });

    // if not exists, throw error

    if (!CityExist) {
      return res.status(400).json({
        success: false,
        error: "City Not Exists",
        data: {},
      });
    }

    const hasCompanies = await prisma.companies.findMany({
      where: { cities_id: Number(id) },
    });

    if (hasCompanies.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Delete Companies first",
        data: {
          total: hasCompanies.length,
          companies: hasCompanies,
        },
      });
    }

    const city = await prisma.cities.delete({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful city delete",
      data: city,
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
  getCities,
  getCityByID,
  putCitiesById,
  deleteCitiesById,
};
