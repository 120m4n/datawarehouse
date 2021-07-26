const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCountryByID = async (req, res) => {
  const { id } = req.params;
  try {
    const countryData = await prisma.countries.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        cities: {
          select: {
            id: true,
            name: true,
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

// const postCountrys = async (req, res) => {
//   const body = req.body;
//   try {
//     let CountryExist;
//     const { name } = req.body;

//     CountryExist = await prisma.Countrys.findFirst({
//       where: { name: name },
//     });

//     if (CountryExist) {
//       return res.status(400).json({
//         success: false,
//         error: "Country with this name already exists",
//         data: {},
//       });
//     }

//     const Country = await prisma.Countrys.create({
//       data: body,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Successful user creation",
//       data: Country,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//       data: {},
//     });
//   }
// };

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
      where: { countries_id: Number(id) },
    });

    if (hasCities.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Delete Cities first",
        data: hasCities,
      });
    }

    const country = await prisma.countries.delete({
      where: { id: Number(id) },
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
  // postCountrys,
  getCountryByID,
  putCountriesById,
  deleteCountriesById,
};
