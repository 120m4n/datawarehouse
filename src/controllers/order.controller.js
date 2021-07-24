const OrderService = require("../services/order.service");

const asyncGetAll = async (req, res) => {
  try {
    const rows = await OrderService.getAllOrder();
    return res.status(200).json({
      success: true,
      message: "All Orders",
      data: rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {}
    });
  }
};

const asyncGetAllByUser = async (req, res) => {
  try {
    const { id_user } = req.params;
    const rows = await OrderService.getAllOrderByUserId(id_user);
    return res.status(200).json({
      success: true,
      message: 'All order by id_User',
      id_user: id_user,
      data: rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: 0,
      message: err.message,
    });
  }
};

const asyncCreate = async (req, res) => {
  try {
    const body = req.body;
    const exist = await OrderService.existIdUser(body.id_user);
    
    if (exist.length ==0) {
      return res.status(404).json({
        success: false,
        message: "User dont exist",
        data: {}
      });
    }

    const neworder = await OrderService.createOrder(body);
    const id_order = neworder.insertId;
    const products = req.body.products;

    const pArray = products.map(async (item) => {
      const { id_product, quantity } = item;

      const product = await OrderService.existProduct(id_product);
      if (product.length === 0) {
        throw new Error("Product not found, id_product:"+id_product);
      }

      const price = await OrderService.getPrice(id_product);
      const rows = await OrderService.addDetail(
        id_order,
        id_product,
        quantity,
        price
      );

      // return rows;
      return {
        id_order_details: rows.insertId,
        id_product: id_product,
        quantity: quantity,
        price: price,
      };
    });

    const results = await Promise.all(pArray);

    return res.status(200).json({
      success: true,
      message: "Order Create successfully",
      order: id_order,
      data: results,
    });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const asyncUpdate = async (req, res) => {
  try {
    const id_state = req.body.id_state;
    const { id_order } = req.params;
    const existOrder = await OrderService.getOrderById(id_order);
    if (existOrder.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
        data: {}
      });
    }
    const oldStatus = existOrder[0].order_state
    const rows = await OrderService.updateStatus(id_state, id_order);
    const currentStatus = await OrderService.getOrderById(id_order);
    return res.status(200).json({
      success: true,
      message: 'Order State Update',
      data: {
        id_order: id_order,
        old_status: oldStatus,
        new_status: currentStatus[0].order_state,
      }
    });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {}
    });
  }
};

const asyncDelete = async (req, res) => {
  try {
    const { id_order} = req.params;
    let rows = await OrderService.getOrderById(id_order);
    if (rows.length > 0) {
      let order_detail = await OrderService.deleteOrderDetail(id_order);
      let order = await OrderService.deleteOrder(id_order);

      return res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
        data: {}
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: {}
    });
  }
};

module.exports = {
  asyncGetAll,
  asyncGetAllByUser,
  asyncCreate,
  asyncUpdate,
  asyncDelete,
};
