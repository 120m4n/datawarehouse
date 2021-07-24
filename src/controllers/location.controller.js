// const { genSaltSync, hashSync, compareSync } = require("bcrypt");
// const { sign } = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Create = async (req, res) => {
  const body = req.body;
  try {
    const user = await prisma.regions.create({
      data: body,
    });

    return res.status(200).json({
      success: true,
      message: "Successful region creation",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const Read = async (req, res) => {
  try {
    const allRegions = await prisma.regions.findMany({
      include: {
        countries: {
          include: {
            cities: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "All regions info",
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

const ReadCountries = async (req, res) => {
  try {
    const { id } = req.params;

    const cityExist = await prisma.regions.findFirst({
      where: { id: Number(id) },
    });

    if (!cityExist) {
      return res.status(400).json({
        success: false,
        error: "Region Not Exists",
        data: {},
      });
    }

    const allCountries = await prisma.regions.findMany({
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

    return res.status(200).json({
      success: true,
      message: `All Countries of Region: ${id}`,
      data: allCountries,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const ReadCities = async (req, res) => {
  try {
    const { id } = req.params;

    const cityExist = await prisma.regions.findFirst({
      where: { id: Number(id) },
    });

    if (!cityExist) {
      return res.status(400).json({
        success: false,
        error: "City Not Exists",
        data: {},
      });
    }
    // region >> country >> cities
    const allCountries = await prisma.regions.findMany({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        countries: {
          select: {
            name: true,
            cities: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `All info from city: ${id}`,
      data: allCountries,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const Update = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  let user;
  try {
    if (body.password) {
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);

      user = await prisma.users.update({
        where: { id: Number(id) },
        data: {
          lastname: body.lastname,
          password: body.password,
          isadmin: body.isadmin,
        },
        select: {
          id: true,
          username: true,
          lastname: true,
          isadmin: true,
        },
      });
    } else {
      user = await prisma.users.update({
        where: { id: Number(id) },
        data: {
          lastname: body.lastname,
          isadmin: body.isadmin,
        },
        select: {
          id: true,
          username: true,
          lastname: true,
          isadmin: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successful user update",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.delete({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        lastname: true,
        email: true,
        isadmin: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful user delete",
      data: user,
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
  Create,
  Read,
  ReadCountries,
  ReadCities,
  Update,
  Delete,
};
