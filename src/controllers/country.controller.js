const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCountryByID = async (req, res) => {
  const { id } = req.params;
  try {
    const countryData = await prisma.countries.findFirst({
      where: { id: Number(id), isactive: true },
      select: {
        id: true,
        name: true,
        regions_id: true,
        cities: {
          select: {
            id: true,
            name: true,
            isactive: true,
          },
        },
      },
    });
    if (countryData) {
      return res.status(200).json({
        success: true,
        message: "Country info",
        data: countryData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Country not found",
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

const getCountries = async (req, res, next) => {
  try {
    const allCountrys = await prisma.countries.findMany({
      select: {
        id: true,
        name: true,
        isactive: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "All Countries",
      data: allCountrys,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const postCity = async (req, res) => {
  const id = req.params.id; //id of country
  try {
    let CountryExist;
    const { name } = req.body;

    CountryExist = await prisma.countries.findFirst({
      where: { id: Number(id) },
    });

    if (!CountryExist) {
      return res.status(409).json({
        success: false,
        message: "Country with this id does not exist",
        data: {},
      });
    }

    const cityExists = await prisma.cities.findFirst({
      where: {
        countries_id: Number(id),
        name: name,
      },
    });

    if (cityExists) {
      return res.status(409).json({
        success: false,
        message: "City with this name already exists",
        data: {},
      });
    }

    const city = await prisma.cities.create({
      data: {
        name: name,
        countries_id: Number(id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful city creation",
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

const putCountriesById = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  let Country;
  try {
    const CountryExist = await prisma.countries.findFirst({
      where: { id: Number(id) },
    });

    // if not exists, throw error

    if (!CountryExist) {
      return res.status(400).json({
        success: false,
        error: "Country Not Exists",
        data: {},
      });
    }

    Country = await prisma.countries.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful country update",
      data: Country,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const deleteCountriesById = async (req, res) => {
  const { id } = req.params;
  try {
    const CountryExist = await prisma.countries.findFirst({
      where: { id: Number(id) },
    });

    // if not exists, throw error

    if (!CountryExist) {
      return res.status(400).json({
        success: false,
        error: "Country Not Exists",
        data: {},
      });
    }

    const hasCities = await prisma.cities.findMany({
      where: { countries_id: Number(id), isactive: true},
    });

    if (hasCities.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Delete Cities first",
        data: hasCities,
      });
    }

    const country = await prisma.countries.update({
      where: { id: Number(id) },
      data:{ isactive: false},
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful city delete",
      data: country,
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
  getCountries,
  getCountryByID,
  putCountriesById,
  deleteCountriesById,
  postCity,
};
