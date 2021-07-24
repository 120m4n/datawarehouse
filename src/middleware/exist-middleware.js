const { existIdProduct } = require("../services/product.service");

const ProductExist = (req, res, next) => {

    const { id_product } = req.params;
    
    try {
      if (id_product) {
            
          let product = existIdProduct(id_product);

          product.then((value) => {
              if (value.length) {
                  next();
              }
              else {
                res.status(400).json({
                success: false,
                message: "id_product not exist",
                data: {},
                });
                  
              }
          });
        
      } else {
        res.status(400).json({
          success: false,
          message: "a valid id_product must be provided",
          data: {},
        });
      }
    } catch (error) {

      res.status(403).json({
        success: false,
        message: error,
        data: {},
      });
    }    

};

const UserExist = (req, res, next) => {
  const { id_product } = req.params;

  try {
    if (id_product) {
      let product = existIdProduct(id_product);

      product.then((value) => {
        if (value.length) {
          next();
        } else {
          res.status(400).json({
            success: false,
            message: "id_product not exist",
            data: {},
          });
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: "a valid id_product must be provided",
        data: {},
      });
    }
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error,
      data: {},
    });
  }
};

module.exports = {
  ProductExist,
};