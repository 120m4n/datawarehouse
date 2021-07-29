require("dotenv").config();

const createError = require("http-errors");


// Importacion de variables de entorno
const API_PORT = process.env.PORT || 3000;

const compression = require("compression");
const express = require("express");
const path = require("path");
const app = express();

// general config
app.set("env", process.env.ENVIRONMENT || "development");
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "public")));


//middleware
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:["'self'"],
        scriptSrc: ["'self'", "https://code.jquery.com"],
        styleSrc: ["'self'", "https://maxcdn.bootstrapcdn.com"],
      },
    },
  })
);

app.use(morgan("dev"));
app.use(express.json(), compression(), cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

const UserRouter = require("./routers/user.router");
const RegionRouter = require("./routers/region.router");
const CountryRouter = require("./routers/country.router");
const ContactRouter = require("./routers/contact.router");
// const LocationRourter = require("./routers/location.router");


/* GET home page. */
app.get("/", function (req, res, next) {
  // res.render("pages/login", { title: "Login" });
  const html = `
    <html>
      <head>
        <title>Login</title>
      </head>
      <body>
        <h1>Login</h1>
        <form action="/users/login" method="post">
          <input type="text" name="username" placeholder="Username">
          <input type="password" name="password" placeholder="Password">
          <input type="submit" value="Login">
        </form>
      </body>
    </html>
  `;
  res.send(html);


});

app.use("/users", UserRouter);
app.use("/regions", RegionRouter);
app.use("/countries", CountryRouter);
app.use("/contacts", ContactRouter);
// app.use("/location", LocationRourter);
// app.use("/product", ProductRouter);
// app.use("/order", OrderRouter);

/* ---------------------------------- GESTION DE ERRORES --------------------------------- */
//Endpoint not found error
app.use((req, res, next) => {
  next(createError(404));
});

// Generic Error (MUST BE LAST)
app.use((err, req, res, next) => {
  //log error to console
  // console.error(req.app.get("env"));

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  // res.render("pages/error");
  res.send({ status: "Error", message: err });
  // next();
});

/* ------------------------------- CONNECTION ------------------------------- */
app.listen(API_PORT, (err) => {
  if (err) console.log(err);
  console.log("Server listening on PORT:", API_PORT);
});
