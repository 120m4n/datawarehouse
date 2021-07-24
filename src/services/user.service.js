const connection = require("../db/connection");

//configurtacion asincrona de las llamadas
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

const getAllUser = async () => {
  try {
    let sql = `SELECT id_user,name,last_name,username,email,address,phone, role.description as role
        from user 
        join role on user.id_role = role.id_role`;
    const rows = await query(sql);
    return rows;
  } catch (err) {
    throw err;
  }
};


const getUserById = async (id) => {
    try {
        let sql = `SELECT id_user,name,last_name,username,email,address,phone, role.description as role
                from user
                join role on user.id_role = role.id_role
                where user.id_user = ?;`;
        const rows = await query(sql,[id]);
        return rows;
    } catch (err) {
        throw err;
    }
};

const createUser = async (data) => {
    try {
        let sql = "INSERT INTO user(username,password,email,name,last_name,address,phone,id_role) VALUES (?,?,?,?,?,?,?,2)";;
        const rows = await query(sql, [
            data.username,
            data.password,
            data.email,
            data.name,
            data.last_name,
            data.address,
            data.phone,
        ]);
        return rows;
    } catch (err) {
        throw err;
    }

};

const getUserByUserName = async (username) => {
    try {
      let sql = "SELECT * FROM user where username = ?";
      const rows = await query(sql, [username]);
      return rows;
    } catch (err) {
      throw err;
    }   
}

const getUserByEmail = async (email) => {
  try {
    let sql = "SELECT * FROM user where email = ?";
    const rows = await query(sql, [email]);
    return rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllUser,
  getUserById,
  createUser,
  getUserByUserName,
  getUserByEmail,
};