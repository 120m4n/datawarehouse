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
        job_tittle: true,
        interest: true,
        companies: {
          select: {
            name: true,
          },
        },
        contacts_channels: {
          select: {
            acount: true,
            channels: {
              select: {
                name: true,
              },
            },
            preferences: {
              select: {
                name: true,
              },
            },
          },
        },
        cities: {
          select: {
            id: true,
            name: true,
            countries: {
              select: {
                id: true,
                name: true,
                regions: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
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

const getContactById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const contact = await prisma.contacts.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        lastname: true,
        email: true,
        job_tittle: true,
        companies: {
          select: {
            name: true,
          },
        },
        contacts_channels: {
          select: {
            acount: true,
            channels: {
              select: {
                name: true,
              },
            },
            preferences: {
              select: {
                name: true,
              },
            },
          },
        },
        cities: {
          select: {
            id: true,
            name: true,
            countries: {
              select: {
                id: true,
                name: true,
                regions: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (contact) {
      return res.status(200).json({
        success: true,
        message: "Contact info",
        data: contact,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
        data: {},
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

module.exports = {
  getContacts,
  getContactById,
};
