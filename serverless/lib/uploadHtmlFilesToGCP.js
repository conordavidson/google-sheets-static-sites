const fs = require("fs");
const path = require("path");
const { Compute } = require("google-auth-library");
const { Storage } = require("@google-cloud/storage");
const {
  DIST_PATH,
  ON_DEVELOPMENT,
  GCP_PROJECT_ID,
  GCP_BUCKET_ID
} = require("../constants");

module.exports = routeMap =>
  new Promise((resolve, reject) => {
    if (ON_DEVELOPMENT) {
      console.log("Writing HTML files to dist directory");
      Object.entries(routeMap).forEach(([routeName, markup]) => {
        const filePath = path.join(DIST_PATH, `${routeName}.html`);
        try {
          fs.writeFileSync(filePath, markup);
        } catch (e) {
          reject(e);
        }
      });
      resolve();
    } else {
      console.log("Uploading HTML files to GCP");
      const client = new Compute();
      const storage = new Storage({ projectId: GCP_PROJECT_ID });
      const bucket = storage.bucket(GCP_BUCKET_ID);

      Object.entries(routeMap).forEach(([routeName, markup]) => {
        const file = bucket.file(`${routeName}.html`);
        return file.save(markup, {
          metadata: {
            contentType: "text/html"
          }
        });
      });
      resolve();
    }
  });
