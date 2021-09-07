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

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "https://code.jquery.com"],
//         styleSrc: ["'self'", "https://maxcdn.bootstrapcdn.com"],
//       },
//     },
//   })
// );

app.use(morgan("dev"));
// You can also enable pre-flight across-the-board like so:
// app.options('*', cors()) // include before other routes

// const corsOptions = {
//   origin: '*',
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   "preflightContinue": false,
//   aallowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Content-Length", "X-CSRF-Token", "X-XSRF-TOKEN", "X-CSRF-Token-From-App"],
//   "optionsSuccessStatus": 204
// };

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(express.json(), compression(), cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

const UserRouter = require("./routers/user.router");
const RegionRouter = require("./routers/region.router");
const CountryRouter = require("./routers/country.router");
const CityRouter = require("./routers/city.router");
const ContactRouter = require("./routers/contact.router");
const CompanyRouter = require("./routers/company.router");
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
app.use("/cities", CityRouter);
app.use("/contacts", ContactRouter);
app.use("/companies", CompanyRouter);

// app.use("/location", LocationRourter);
// app.use("/product", ProductRouter);
// app.use("/order", OrderRouter);

/* ---------------------------------- GESTION DE ERRORES --------------------------------- */
//Endpoint not found error
app.use((req, res, next) => {
  console.log("Error 404: Endpoint not found");
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
  res.send({ status: "false", message:'server' ,data:err });
  // next();
});

/* ------------------------------- CONNECTION ------------------------------- */
app.listen(API_PORT, (err) => {
  if (err) console.log(err);
  console.log("Server listening on PORT:", API_PORT);
});
