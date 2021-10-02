const validator = require("../helpers/validate");

const userData = (req, res, next) => {
  const validationRule = {
    username: "required|string|min:5|max:35",
    lastname: "required|string|max:35",
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
    lastname: "required|string|max:35",
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


const username = (req, res, next) => {
  const validationRule = {
    username: "required|string|min:5|max:35",
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

const contactData = (req, res, next) => {
  const validationRule = {
    username: "required|string|min:5|max:100",
    lastname: "required|string|max:100",
    job_tittle: "required|string|max:100",
    address: "required|string|max:100",
    email: "required|email",
    users_id: "required|integer",
    companies_id: "required|integer",
    cities_id: "required|integer",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        error: err.errors,
        data:  {},
      });
    } else {
      next();
    }
  });
};

const contactChannelData = (req, res, next) => {
  const validationRule = {
    acount: "required|string|min:5|max:100",
    channels_id: "required|integer",
    preferences_id: "required|integer",
    contacts_id: "required|integer",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        error: err.errors,
        data:  {},
      });
    } else {
      next();
    }
  });
}
const companyData = (req, res, next) => {
  const validationRule = {
    name: "required|string|min:5|max:100",
    address: "required|string|max:100",
    email: "required|email",
    phone: "required|string|max:25",
    cities_id: "required|integer",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        error: err.errors,
        data:  {},
      });
    } else {
      next();
    }
  });
};


const dataName = (req, res, next) => {
  const validationRule = {
    name: "required|string|min:4|max:35",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        error: err.errors.name,
        data: {},
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
        error: err.errors.id.join('\n'),
        data: {},
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
  dataName,
  companyData,
  contactData,
  contactChannelData,
  email,
  id,
  // product,
  // status,
  // order,
};
