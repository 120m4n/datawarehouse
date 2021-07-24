const connection = require("../db/connection");

//configurtacion asincrona de las llamadas
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

const getAllOrder = async () => {
  try {
    let sql = `SELECT o.id_order, o.time, st.order_state , pay.method , u.username, u.address 
    FROM orders o 
    JOIN order_state st ON o.id_state = st.id_state 
    JOIN payment pay ON o.id_payment = pay.id_payment 
    JOIN user u ON o.id_user = u.id_user ORDER BY o.time desc;`;
    const rows = await query(sql)
    return rows;
  } catch (err) {
    throw err;
  }

}

const getAllOrderByUserId = async (id_user) => {
    try {
      let sql = `SELECT o.id_order, o.time, st.order_state , pay.method , u.username, u.address 
          FROM orders o , user u, order_state st, payment pay
          where o.id_state = st.id_state 
          and o.id_payment = pay.id_payment 
          and o.id_user = u.id_user 
          and u.id_user = ?
          ORDER BY o.time desc;`;
      const rows = await query(sql, [id_user]);
      return rows;
    } catch (err) {
      throw err;
    }
}

const createOrder = async (data) => {
    try {
      // console.log("createorder: "+ data);
      let sql = `insert into orders (id_user, id_payment, id_state) values (?,?,1)`;
      const rows = await query(sql, [data.id_user, data.id_payment]);
      return rows;
    } catch (err) {
      throw err;
    }
};

const getPrice = async (id_product) => {
    try {
      let sql = `SELECT price FROM product WHERE id_product = ?`;
      const rows = await query(sql, [id_product]);
        // await console.log(rows[0].price);
        return rows[0].price;
        
    } catch (err) {
      throw err;
    }
};

const addDetail = async (id_order, id_product, quantity, price) => {
    try {
        let sql = `INSERT INTO order_detail(id_order, id_product, quantity, subtotal) VALUES(?, ?, ?, ?)`;
        const rows = await query(sql, [id_order, id_product, quantity, quantity*price]);
        return rows;
    } catch (err) {
        throw err;
    }

};

const updateStatus = async ( id_state,id_order) => {
    try {
      let sql = `UPDATE orders SET id_state = ? WHERE id_order = ?`;
      const rows = await query(sql, [
        id_state,
        id_order,
      ]);
      return rows;
    } catch (err) {
      throw err;
    }
};

const getOrderById = async (id_order) => {
  try {
    let sql = `select o.id_order , os.order_state 
        from orders o , order_state os 
        where o.id_state = os.id_state 
        and o.id_order=?`;
    const rows = await query(sql, [id_order]);
    return rows;
  } catch (err) {
    throw err;
  }
};

const deleteOrderDetail = async (id_order) => {
  try {
    let sql = `DELETE FROM order_detail WHERE id_order = ?`;
    const rows = await query(sql, [id_order]);
    return rows;
  } catch (err) {
    throw err;
  }
};

const deleteOrder = async  (id_order) => {
  try {
    let sql = `DELETE FROM orders WHERE id_order = ?`;
    const rows = await query(sql, [id_order]);
    return rows;
  } catch (err) {
    throw err;
  }
};

const existIdUser = async (id_user) => {
  try {
    let sql = `select id_user, id_role FROM user WHERE id_user = ?`;
    const rows = await query(sql, [id_user]);
    return rows;
  } catch (err) {
    throw err;
  }
};

const existProduct = async (id_product) => {
  try {
    let sql = `select id_product from product WHERE id_product = ?`;
    const rows = await query(sql, [id_product]);
    return rows;
  } catch (err) {
    throw err;
  }
};
module.exports = {
  existIdUser,
  existProduct,
  getAllOrder,
  getAllOrderByUserId,
  createOrder,
  getPrice,
  addDetail,
  updateStatus,
  getOrderById,
  deleteOrderDetail,
  deleteOrder,
};