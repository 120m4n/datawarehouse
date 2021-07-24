const connection = require("../db/connection");

//configurtacion asincrona de las llamadas
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

const getAllProducts = async () => {
  try {
    let sql =
      "SELECT id_product, product_name, price, availability  FROM product";
    const rows = await query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

const existIdProduct = async (id_product) => {
  try {
    let sql = `SELECT * FROM product  WHERE id_product = ?;`;
    const rows = await query(sql, [id_product]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    let sql = `SELECT * FROM product  WHERE id_product = ? and availability=1;`;
    const rows = await query(sql, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const createProduct = async (product_name, price) => {
  try {
    let sql = "INSERT INTO product (product_name, price) VALUES (?,?)";
    const rows = await query(sql, [product_name, price]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (product_name, price, availability, id) => {
  try {
    let sql =
      "UPDATE product SET product_name = ?, price = ?, availability = ? WHERE id_product = ?";
    const rows = await query(sql, [product_name, price, availability, id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getFavoriteProductById = async (id) => {
  try {
    let sql = `SELECT * FROM favorite WHERE id_product = ?`;
    const rows = await query(sql, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getOrderDetailsProductById = async (id) => {
  try {
    let sql = `SELECT * FROM order_detail WHERE id_product = ?`;
    const rows = await query(sql, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const softDeleteProduct = async (id) => {
  try {
    let sql = `UPDATE product SET availability = 0 WHERE id_product = ?`;
    const rows = await query(sql, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    let sql = "DELETE FROM product WHERE id_product = ?";
    const rows = await query(sql, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  existIdProduct,
  getFavoriteProductById,
  getOrderDetailsProductById,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
  deleteProduct,
};
