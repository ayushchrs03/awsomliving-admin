const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
app.use(express.static(path.join(__dirname, "../") + "dist"));
app.get("/*", function (req, res) {
  res.sendFile("index.html", { root: "./../dist" });
});
app.listen(process.env.PORT);
