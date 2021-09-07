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
  // console.log(body);
  try {
    let CompanyExists;
    const { email } = req.body;
    const { Companyname } = req.body;

    CompanyExists = await prisma.Companys.findUnique({
      where: { email: email },
    });

    if (CompanyExists) {
      return res.status(400).json({
        success: false,
        message: "Company with this email already exists",
        data: {},
      });
    }

    CompanyExists = await prisma.Companys.findUnique({
      where: { Companyname: Companyname },
    });

    if (CompanyExists) {
      return res.status(409).json({
        success: false,
        message: "Company with this Companyname already exists",
        data: {},
      });
    }

    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    const Company = await prisma.Companys.create({
      data: body,
    });

    Company.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Successful Company creation",
      data: Company,
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
  let Company;
  try {
    const CompanyExists = await prisma.Companys.findFirst({
      where: { id: Number(id) },
    });

    // if not exists, throw error

    if (!CompanyExists) {
      return res.status(400).json({
        success: false,
        error: "Company Not Exists",
        data: {},
      });
    }

    if (body.password) {
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);

      Company = await prisma.Companys.update({
        where: { id: Number(id) },
        data: {
          lastname: body.lastname,
          password: body.password,
          isadmin: body.isadmin,
        },
        select: {
          id: true,
          Companyname: true,
          lastname: true,
          isadmin: true,
        },
      });
    } else {
      Company = await prisma.Companys.update({
        where: { id: Number(id) },
        data: {
          lastname: body.lastname,
          isadmin: body.isadmin,
        },
        select: {
          id: true,
          Companyname: true,
          lastname: true,
          isadmin: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successful Company update",
      data: Company,
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
    const CompanyExists = await prisma.Companys.findFirst({
      where: { id: Number(id) },
      select: { 
        contacts:true,
      }
    });

    // if not exists, throw error

    if (!CompanyExists) {
      return res.status(400).json({
        success: false,
        error: "Company Not Exists",
        data: {},
      });
    }

    const hasContacts = CompanyExists.contacts.length;
    // Company has contacts
    if (hasContacts > 0) {
      const Company = await prisma.Companys.update({
        where: { id: Number(id) },
        data: { isactive: false},
        select: {
          id: true,
          Companyname: true,
          lastname: true,
          email: true,
          isadmin: true,
        },
      });
  
      return res.status(200).json({
        success: true,
        message: "Successful Company delete",
        data: Company,
      });

    }

    const Company = await prisma.Companys.delete({
      where: { id: Number(id) },
      select: {
        id: true,
        Companyname: true,
        lastname: true,
        email: true,
        isadmin: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Successful Company delete",
      data: Company,
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
  // Create,
  // Update,
  // Delete,
};
