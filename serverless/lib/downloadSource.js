const path = require("path");
const admZip = require("adm-zip");
const request = require("axios");
const fs = require("fs");

const { OUTPUT_PATH, EXTRACT_PATH } = require("../constants");

module.exports = req =>
  new Promise((resolve, reject) => {
    console.log("Downloading source");
    const writer = fs.createWriteStream(OUTPUT_PATH);

    request({
      url: req.body.source,
      method: "GET",
      responseType: "stream"
    }).then(response => {
      console.log("Writing to tmp");

      response.data.pipe(writer);
      writer.on("finish", () => {
        console.log("Extracting zip");

        const zip = new admZip(OUTPUT_PATH);
        zip.extractAllTo(EXTRACT_PATH, true);
        resolve();
      });
    });
  });
