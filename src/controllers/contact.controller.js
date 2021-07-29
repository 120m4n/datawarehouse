const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getContacts = async (req, res, next) => {
  try {
    const allContacts = await prisma.contacts.findMany({
      select: {
        id: true,
        username: true,
        lastname: true,
        email: true,
        position: true,
        companies: {
          select: {
            name: true,
          },
        },
        regions: {
          select: {
            name: true,
          },
        },
      },
    });
    const total = allContacts.length;

    return res.status(200).json({
      total: total,
      rows: allContacts,
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
  getContacts,
};
