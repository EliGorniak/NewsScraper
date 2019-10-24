const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");

const exphbs = require("express-handlebars");

const db = require("./models");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database:
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Define the port:
const PORT = process.env.PORT || 3000;

// Define Express application:
const app = express();

app.use(logger("dev"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const apiRoutes = require("./routes/api-routes.js");
app.use(apiRoutes);

app.listen(PORT, function() {
  console.log("App now listening at localhost:" + PORT);
});
