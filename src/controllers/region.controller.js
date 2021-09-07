const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getRegionByID = async (req, res) => {
  const { id } = req.params;
  try {
    const regionData = await prisma.regions.findFirst({
      where: { id: Number(id), isactive: true },
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

const getTreeview = async (req, res) => {
  let prefixCountry = 100;
  let prefixCity = 1000;


  try {

    const getRegiones = await prisma.regions.findMany({
      where: { isactive: true },
      select: {
        id: true,
        name: true,
      },
    });

    const getCountries = await prisma.countries.findMany({
      where: { isactive: true },
      select: {
        id:true,
        name:true,
        regions_id: true,
      },
    }); 

    const getCities = await prisma.cities.findMany({
      where: { isactive: true },
      select: {
        id:true,
        name:true,
        countries_id: true,
      }
    });

    const regiones = getRegiones.map(el => {
      return { 'Id': el.id, 'Title': el.name.padEnd('25','.'), 'ParentId' : 0, 'Type':'region', 'bdId':el.id }
    });

    
    const countries = getCountries.map(el => {
      return { 'Id': prefixCountry + el.id, 'Title': el.name.padEnd('25','.'), 'ParentId' : el.regions_id, 'Type':'country', 'bdId':el.id }
    });



    const cities = getCities.map(el => {
      return { 'Id': prefixCity + el.id, 'Title': el.name.padEnd('25','.'), 'ParentId' : prefixCountry + el.countries_id, 'Type':'city', 'bdId':el.id }
    });

    const resultList = [{ 'Id' : 0, 'Title' : 'My Tree','ParentId' : null }].concat(regiones,countries,cities);

    return res.status(200).json({
      data: resultList,
    });

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
      where:{isactive: true},
      select: {
        id: true,
        name: true,
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
      return res.status(409).json({
        success: false,
        message: "Region with this name already exists",
        data: {},
      });
    }

    const region = await prisma.regions.create({
      data: body,
    });

    return res.status(200).json({
      success: true,
      message: "Successful region creation",
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

const postCountry = async (req, res) => {
  const id = req.params.id; //id of region

  try {
    let countryExists;
    const { name } = req.body;

    regionExist = await prisma.regions.findFirst({
      where: { id: Number(id) },
    });
    // if not exists, throw error
    if (!regionExist) {
      return res.status(409).json({
        success: false,
        message: "Region with this id does not exist",
        data: {},
      });
    }

    countryExists = await prisma.countries.findFirst({
      where: {
        regions_id: Number(id),
        name: name,
      },
    });

    if (countryExists) {
      return res.status(409).json({
        success: false,
        message: "Country with this name already exists",
        data: {},
      });
    }

    const country = await prisma.countries.create({
      data: {
        name: name,
        regions_id: Number(id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful country creation",
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
      select:{
        countries:true,
      }
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
      where: { regions_id: Number(id), isactive: true  },
    });

    if (hasCountries.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Delete Countries first",
        data: hasCountries,
      });
    }

    const region = await prisma.regions.update({
      where: { id: Number(id) },
      data:{ isactive: false},
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
  getTreeview,
  postRegions,
  getRegionByID,
  putRegionsById,
  deleteRegionsById,
  postCountry,
};
