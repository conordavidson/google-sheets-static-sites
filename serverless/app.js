const path = require("path");
const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const getProducts = require("./requests/getProducts");
const uploadHTMLFileToGCP = require("./requests/uploadHTMLFileToGCP");
const uploadPublicDirToGCP = require("./requests/uploadPublicDirToGCP");
const configureView = require("./lib/configureView");
const extractSiteData = require("./lib/extractSiteData");
const renderSite = require("./lib/renderSite");
const { ON_PRODUCTION, ON_DEVELOPMENT, CLIENT_SECRET } = require("./constants");

const app = express();
app.use(bodyParser.json());
app.post("/", (req, res) => {
  if (ON_PRODUCTION && !req.get("CLIENT_SECRET")) return res.status(403).send();
  if (ON_PRODUCTION && req.get("CLIENT_SECRET") !== CLIENT_SECRET)
    return res.status(403).send();

  return configureView(app, req)
    .then(() => extractSiteData(req))
    .then(siteData => renderSite(siteData, res))
    .then(() => res.status(200).send())
    .catch(err => {
      console.log("error", err);
      res.status(422).send();
    });
});

module.exports = app;
