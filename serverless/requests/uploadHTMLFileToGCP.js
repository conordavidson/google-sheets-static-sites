const { Compute } = require("google-auth-library");
const { Storage } = require("@google-cloud/storage");
const {
  ON_PRODUCTION,
  GCP_PROJECT_ID,
  GCP_BUCKET_ID
} = require("../constants");

module.exports = routeMap => {
  if (ON_PRODUCTION) {
    const client = new Compute();
  }

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
};
