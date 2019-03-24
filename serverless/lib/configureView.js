const path = require("path");
const express = require("express");
const reactViews = require("express-react-views");

module.exports = (app, req) =>
  new Promise((resolve, reject) => {
    app.set("view engine", "jsx");
    app.engine("jsx", reactViews.createEngine());
    app.set("views", path.join(__dirname, "../../test-src/views"));
    app.use(express.static("../../test-src/public"));
    resolve();
  });
