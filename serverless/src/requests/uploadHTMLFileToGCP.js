const { Compute } = require("google-auth-library");
const { Storage } = require("@google-cloud/storage");
const {
  ON_PRODUCTION,
  GCP_PROJECT_ID,
  GCP_BUCKET_ID,
  INDEX_FILE_PATH
} = require("../constants");

module.exports = html => {
  if (ON_PRODUCTION) {
    const client = new Compute();
  }

  const storage = new Storage({ projectId: GCP_PROJECT_ID });
  const bucket = storage.bucket(GCP_BUCKET_ID);
  const file = bucket.file(INDEX_FILE_PATH);
  return file.save(html, {
    metadata: {
      contentType: "text/html"
    }
  });
};
