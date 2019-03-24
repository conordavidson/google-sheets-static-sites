const path = require("path");
const admZip = require("adm-zip");
const request = require("axios");
const fs = require("fs");

const { OUTPUT_PATH, EXTRACT_PATH } = require("../constants");

module.exports = req =>
  new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(OUTPUT_PATH);
    request({
      url: req.body.source,
      method: "GET",
      responseType: "stream"
    }).then(response => {
      response.data.pipe(writer);
      writer.on("finish", () => {
        const zip = new admZip(OUTPUT_PATH);
        zip.extractAllTo(EXTRACT_PATH, true);
        resolve();
      });
    });
  });
