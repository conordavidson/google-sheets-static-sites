const path = require("path");
const express = require("express");
const hbs = require("express-handlebars");

module.exports = (app, req) =>
  new Promise((resolve, reject) => {
    app.engine(
      "handlebars",
      hbs({
        defaultLayout: "main",
        layoutsDir: path.join(__dirname, "../../test-src/views/layouts")
      })
    );
    app.use(express.static("../../test-src/public"));
    app.set("views", path.join(__dirname, "../../test-src/views"));
    app.set("view engine", "handlebars");
    resolve();
  });
