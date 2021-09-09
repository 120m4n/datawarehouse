const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCompanyByID = async (req, res) => {
  const { id } = req.params;
  try {
    const companyData = await prisma.companies.findFirst({
      where: { id: Number(id), isactive: true},
      select: {
        id: true,
        name: true,
        address: true,
        email: true,
        phone: true,
        cities: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (companyData) {
      return res.status(200).json({
        success: true,
        message: "Company info",
        data: companyData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Company not found",
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

const getCompanies = async (req, res, next) => {
  try {
    const allCompanies = await prisma.companies.findMany({
      where: { isactive: true },
      select: {
        id: true,
        name: true,
        address: true,
        email: true,
        phone: true,
        cities: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const total = allCompanies.length;

    return res.status(200).json({
      total: total,
      rows: allCompanies,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const Create = async (req, res) => {
  const body = req.body;
  try {
    let companyExists;
    const { name } = req.body;

    companyExists = await prisma.companies.findFirst({
      where: { name: name },
    });

    if (companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company with this name already exists",
        data: {},
      });
    }

    const company = await prisma.companies.create({
      data: body,
    });

    return res.status(200).json({
      success: true,
      message: "Successful Company creation",
      data: company,
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
  let company;
  try {
    const companyExists = await prisma.companies.findFirst({
      where: { id: Number(id) },
    });

    // if not exists, throw error

    if (!companyExists) {
      return res.status(404).json({
        success: false,
        error: "Company Not Exists",
        data: {},
      });
    }

    company = await prisma.companies.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        address: body.address,
        email: body.email,
        phone: body.phone,
        cities_id: body.cities_id,
      },
    });
    
    return res.status(200).json({
      success: true,
      message: "Successful Company update",
      data: company,
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
    const companyExists = await prisma.companies.findFirst({
      where: { id: Number(id) },
      select: { 
        contacts:true,
      }
    });

    // if not exists, throw error

    if (!companyExists) {
      return res.status(400).json({
        success: false,
        error: "Company Not Exists",
        data: {},
      });
    }

    const hasContacts = companyExists.contacts.length;
    // Company has contacts
    if (hasContacts > 0) {
      const company = await prisma.companies.update({
        where: { id: Number(id) },
        data: { isactive: false},
        select: {
          id: true,
          name: true,
        },
      })
  
      return res.status(200).json({
        success: true,
        message: "Successful Company delete",
        data: company,
      });

    }

    const company = await prisma.companies.delete({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        address: true,
        email: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful Company delete",
      data: company,
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
  getCompanyByID,
  getCompanies,
  Create,
  Update,
  Delete,
};
