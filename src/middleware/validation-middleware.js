const validator = require("../helpers/validate");

const userData = (req, res, next) => {
  const validationRule = {
    username: "required|string|min:5|max:25",
    lastname: "required|string|max:25",
    email: "required|email",
    password: "required|string|min:6",
    isadmin: "required|boolean",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: "validation",
        data: err,
      });
    } else {
      next();
    }
  });
};

const userUpdateData = (req, res, next) => {
  const validationRule = {
    // username: "required|string|min:5|max:25",
    lastname: "required|string|max:25",
    // email: "required|email",
    password: "string|min:6",
    isadmin: "required|boolean",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: "validation",
        data: err,
      });
    } else {
      next();
    }
  });
};

const login = (req, res, next) => {

    // const body = req.body;
    // console.log(body);
  const validationRule = {
    username: "required|string",
    password: "required|string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const order = (req, res, next) => {
  const validationRule = {
    id_user: "required|numeric",
    id_payment: "required|numeric|min:1|max:3",
    products: "required",
    "products.*.id_product": "required|numeric",
    "products.*.quantity": "required|numeric",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const product = (req, res, next) => {
  const validationRule = {
    product_name: "required|string",
    price: "required|numeric|max:1000000",
    availability: "boolean",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const username = (req, res, next) => {
  const validationRule = {
    username: "required|string|min:5|max:25",
  };
  validator(req.params, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const locationName = (req, res, next) => {
  const validationRule = {
    name: "required|string|min:4|max:25",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const email = (req, res, next) => {
  const validationRule = {
    email: "required|email",
  };
  validator(req.params, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const id = (req, res, next) => {
  const validationRule = {
    id: "required|numeric",
  };
  validator(req.params, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: "validation",
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = {
  login,
  userData,
  userUpdateData,
  username,
  locationName,
  email,
  id,
  // product,
  // status,
  // order,
};
