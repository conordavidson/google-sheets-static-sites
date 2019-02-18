const GoogleSpreadsheet = require("google-spreadsheet");

const {
  GOOGLE_SHEET_ID,
  GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
} = require("../constants");

module.exports = () =>
  new Promise((resolve, reject) => {
    const sheet = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
    sheet.useServiceAccountAuth(GOOGLE_SERVICE_ACCOUNT_CREDENTIALS, e => {
      sheet.getInfo((err, info) => {
        const productWorksheet = info.worksheets.find(
          worksheet => worksheet.title === "products"
        );
        if (!productWorksheet) reject("products worksheet not found");

        productWorksheet.getRows({ offset: 1, limit: 250 }, (err, rows) => {
          const products = rows.map(product => {
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

          resolve(products);
        });
      });
    });
  });
