const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
// const koa = require("koa");
// const server = new koa();
const { readdirSync } = require("fs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("API MEBEL MURAH"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to db was succesfull"))
  .catch((error) => console.log(`Connection to db was failed: ${error}`));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

readdirSync(__dirname + "/routes").map((route) =>
  app.use("/api", require(`${__dirname}/routes/${route}`))
);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on successfully`);
});

// module.exports = server.listen(port);
