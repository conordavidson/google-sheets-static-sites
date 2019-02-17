const fs = require("fs");
const express = require("express");
const hbs = require("express-handlebars");
const GoogleSpreadsheet = require("google-spreadsheet");
const { Compute } = require("google-auth-library");
const { Storage } = require("@google-cloud/storage");

let serviceAccountCredentials;

if (process.env.NODE_ENV === "production") {
  const client = new Compute();
  serviceAccountCredentials = JSON.parse(
    process.env.SERVICE_ACCOUNT_CREDENTIALS
  );
}

if (process.env.NODE_ENV === "development") {
  serviceAccountCredentials = require("./.service-account-credentials.json");
}

const app = express();
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.get("/", (req, res) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.get("CLIENT_SECRET") !== process.env.CLIENT_SECRET
  ) {
    return res.status(403).send();
  }

  const doc = new GoogleSpreadsheet(
    "1JrXaQkSndIfU7nh3NVqhzz8mtITuZlTlL56AP-6Wazs"
  );
  let products;
  doc.useServiceAccountAuth(serviceAccountCredentials, e => {
    doc.getInfo((err, info) => {
      const productWorksheet = info.worksheets.find(
        worksheet => worksheet.title === "products"
      );
      if (!productWorksheet) return;

      productWorksheet.getRows({ offset: 1, limit: 250 }, (err, rows) => {
        products = rows.map(product => {
          return {
            category: product.category,
            brand: product.brand,
            name: product.name,
            description: product.description,
            imageSrc: product.imagesrc,
            link: product.link,
            updatedAt: product.updatedat,
            published: !!product.published
          };
        });

        if (process.env.NODE_ENV === "production") {
          return uploadFileToGCP(res, products);
        }

        if (process.env.NODE_ENV === "development") {
          return res.render("index", { products });
        }
      });
    });
  });
});

const uploadFileToGCP = (res, products) => {
  const storage = new Storage({ projectId: "sheets-as-cms" });
  const bucket = storage.bucket("sheets-cms-frontend");
  const file = bucket.file("index.html");

  return res.render("index", { products }, (err, html) => {
    const contents = html;
    return file
      .save(contents, {
        metadata: {
          contentType: "text/html"
        }
      })
      .then(() => {
        console.log("success");
        res.status(200).send();
      })
      .catch(err => {
        console.log("error", err);
        res.status(422).send();
      });
  });
};

module.exports = app;
