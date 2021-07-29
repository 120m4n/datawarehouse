const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserByUserName = async (req, res) => {
  const { username } = req.params;

  try {
    const userData = await prisma.users.findUnique({
      where: { username: username },
      select: {
        id: true,
        username: true,
        lastname: true,
        email: true,
        create_time: true,
        isadmin: true,
      },
    });

    if (userData) {
      return res.status(200).json({
        success: true,
        message: "User info",
        data: userData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const userData = await prisma.users.findUnique({
      where: { email: email },
      select: {
        id: true,
        username: true,
        lastname: true,
        email: true,
        create_time: true,
        isadmin: true,
      },
    });

    if (userData) {
      return res.status(200).json({
        success: true,
        message: "User info",
        data: userData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

const getUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    const userData = await prisma.users.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        lastname: true,
        email: true,
        create_time: true,
        isadmin: true,
      },
    });
    if (userData) {
      return res.status(200).json({
        success: true,
        message: "User info",
        data: userData,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

const getUsers = async (req, res, next) => {
  try {
    const allUsers = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        lastname: true,
        email: true,
        create_time: true,
        isadmin: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "All user info",
      data: allUsers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {},
    });
  }
};

const userExists = async (req, res) => {
  const { username } = req.params;
  try {
    const userData = await prisma.users.findUnique({
      where: { username: username },
    });
    if (userData) {
      return res.status(200).json({
        success: true,
        message: "User exists",
        data: true,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User not exists",
        data: false,
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

const Create = async (req, res) => {
  const body = req.body;
  try {
    let userExists;
    const { email } = req.body;
    const { username } = req.body;

    userExists = await prisma.users.findUnique({
      where: { email: email },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
        data: {},
      });
    }

    userExists = await prisma.users.findUnique({
      where: { username: username },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "User with this username already exists",
        data: {},
      });
    }

    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    const user = await prisma.users.create({
      data: body,
    });

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Successful user creation",
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

const login = async (req, res) => {
  const body = req.body;
  try {
    const userData = await prisma.users.findUnique({
      where: { username: body.username },
    });
    if (userData) {
      //cliente admin/user con el pass descifrado en bd
      let result = body.password === userData.password;

      if (!result) {
        result = compareSync(body.password, userData.password);
      }

      if (result) {
        userData.password = undefined;
        const token = sign({ credentials: userData }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        return res.status(200).json({
          success: true,
          message: "Login successful",
          token: token,
        });
      }
    }
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
      data: {},
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
    const userExists = await prisma.users.findFirst({
      where: { id: Number(id) },
    });

    // if not exists, throw error

    if (!userExists) {
      return res.status(400).json({
        success: false,
        error: "User Not Exists",
        data: {},
      });
    }

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
    const userExists = await prisma.users.findFirst({
      where: { id: Number(id) },
    });

    // if not exists, throw error

    if (!userExists) {
      return res.status(400).json({
        success: false,
        error: "User Not Exists",
        data: {},
      });
    }

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
  Update,
  Delete,
  userExists,
  login,
  getUsers,
  getUserByUserName,
  getUserByEmail,
  getUserByID,
};
