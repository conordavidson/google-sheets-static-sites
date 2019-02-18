const path = require("path");
const express = require("express");
const hbs = require("express-handlebars");
const getProducts = require("./requests/getProducts");
const uploadHTMLFileToGCP = require("./requests/uploadHTMLFileToGCP");
const { ON_PRODUCTION, ON_DEVELOPMENT, CLIENT_SECRET } = require("./constants");

const app = express();
app.engine(
  "handlebars",
  hbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts")
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.get("/", (req, res) => {
  if (ON_PRODUCTION && !req.get("CLIENT_SECRET")) return res.status(403).send();
  if (ON_PRODUCTION && req.get("CLIENT_SECRET") !== CLIENT_SECRET)
    return res.status(403).send();

  return getProducts()
    .then(products => {
      if (ON_DEVELOPMENT) return res.render("index", { products });
      if (ON_PRODUCTION) {
        return res.render("index", { products }, (err, html) => {
          uploadHTMLFileToGCP(html)
            .then(() => {
              console.log("success");
              res.status(200).send();
            })
            .catch(err => {
              console.log("error", err);
              res.status(422).send();
            });
        });
      }
    })
    .catch(err => {
      return res.status(422).send(err);
    });
});

module.exports = app;
