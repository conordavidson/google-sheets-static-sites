const { Compute } = require("google-auth-library");
const { Storage } = require("@google-cloud/storage");
const findit = require("findit");
const fs = require("fs");
const path = require("path");
const {
  ON_PRODUCTION,
  GCP_PROJECT_ID,
  GCP_BUCKET_ID,
  EXTRACT_PATH
} = require("../constants");

module.exports = req =>
  new Promise((resolve, reject) => {
    console.log("Uploading public files to GCP");
    if (ON_PRODUCTION) {
      const client = new Compute();
    }

    const storage = new Storage({ projectId: GCP_PROJECT_ID });
    const bucket = storage.bucket(GCP_BUCKET_ID);
    const publicDirectory = path.join(EXTRACT_PATH, req.body.public);

    const walk = findit(publicDirectory);
    const uploads = [];

    walk.on("file", filePath => {
      return uploads.push(() => bucket.upload(filePath));
    });

    walk.on("end", () => {
      return resolve(Promise.all(uploads.map(upload => upload())));
    });

    walk.on("error", err => {
      walk.stop();
      return reject(err);
    });
  });
