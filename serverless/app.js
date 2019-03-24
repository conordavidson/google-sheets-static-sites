const path = require("path");
const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");

const downloadSource = require("./lib/downloadSource");
const renderSite = require("./lib/renderSite");
const uploadHtmlFilesToGCP = require("./lib/uploadHtmlFilesToGCP");
const uploadPublicDirToGCP = require("./lib/uploadPublicDirToGCP");

const { ON_PRODUCTION, ON_DEVELOPMENT, CLIENT_SECRET } = require("./constants");

const app = express();
app.use(bodyParser.json());

app.post("/", (req, res) => {
  if (ON_PRODUCTION && !req.get("CLIENT_SECRET")) return res.status(403).send();
  if (ON_PRODUCTION && req.get("CLIENT_SECRET") !== CLIENT_SECRET)
    return res.status(403).send();

  return downloadSource(req)
    .then(() => renderSite(req, res))
    .then(uploadHtmlFilesToGCP)
    .then(() => uploadPublicDirToGCP(req))
    .then(() => {
      console.log("Success!");
      res.status(200).send();
    })
    .catch(err => {
      console.log("Error", err);
      res.status(422).send();
    });
});

module.exports = app;
