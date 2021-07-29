var jwt = require("jsonwebtoken");

const AuthorizationAdmin = (req, res, next) => {
  //authorization typeof
  let token = req.get("authorization");
  if (typeof token !== "undefined") {
    try {
      //separate jsonwebtoken
      const tokenArray = token.split(" ");
      token = tokenArray[1];
      //   console.log(token);
      const data = jwt.verify(token, process.env.JWT_SECRET);
      //all data user encode

      let credentials = data.credentials;
      if (credentials.isadmin) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: "You need administrator privileges",
          data: {},
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
        data: {},
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Should have authorization token",
      data: {},
    });
    // res.status(401);

    // res.format({
    //   html: function () {
    //     res.render("pages/login");
    //   },
    //   json: function () {
    //     res.json({ error: "Should have authorization token" });
    //   },
    //   default: function () {
    //     res.type("txt").send("Should have authorization token");
    //   },
    // });
  }
};

const AuthorizationUser = (req, res, next) => {
  //authorization typeof
  let token = req.get("authorization");
  if (typeof token !== "undefined") {
    try {
      //separate jsonwebtoken
      const tokenArray = token.split(" ");
      token = tokenArray[1];
      //   console.log(token);
      jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
          res.status(401).json({
            success: false,
            message: err,
            data: {},
          });
        } else {
          next();
        }
      });
      
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
        data: {},
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Should have authorization token",
      data: {
        link: "/user/login",
      }
    });

  }
};

module.exports = {
  AuthorizationAdmin,
  AuthorizationUser,
};
