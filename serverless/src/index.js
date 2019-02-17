require("dotenv").config({ path: "../.env" });
const { ON_DEVELOPMENT } = require("./constants");
const app = require("./app");

if (ON_DEVELOPMENT) {
  const port = 3000;
  app.listen(port, () => console.log(`~~ running on ${port} ~~`));
}

exports.root = app;
