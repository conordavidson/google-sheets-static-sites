require("dotenv").config();
const app = require("./app");

if (process.env.NODE_ENV === "development") {
  const port = 3000;
  app.listen(port, () => console.log(`~~ running on ${port} ~~`));
}

exports.root = app;
