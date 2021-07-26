require("dotenv").config();

// Importacion de variables de entorno
const API_PORT = process.env.PORT || 3000;

const compression = require("compression");
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");

app.use(express.json(), compression(), helmet(), cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const UserRouter = require("./routers/user.router");
const RegionRouter = require("./routers/region.router");
const CountryRouter = require("./routers/country.router");
// const LocationRourter = require("./routers/location.router");

// const ProductRouter = require("./routers/product.router");
// const OrderRouter = require("./routers/order.router");

app.use("/users", UserRouter);
app.use("/regions", RegionRouter);
app.use("/countries", CountryRouter);
// app.use("/location", LocationRourter);
// app.use("/product", ProductRouter);
// app.use("/order", OrderRouter);

/* ---------------------------------- GESTION DE ERRORES --------------------------------- */
//Endpoint not found error
app.use((req, res) => {
  res.status(404).send({
    status: "Error",
    message: "Endpoint not found",
  });
});

// Generic Error (MUST BE LAST)
app.use((err, req, res, next) => {
  if (err) res.status(err.status).send({ status: "Error", message: err });
  // next();
});

/* ------------------------------- CONNECTION ------------------------------- */
app.listen(API_PORT, (err) => {
  if (err) console.log(err);
  console.log("Server listening on PORT:", API_PORT);
});
