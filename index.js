const express = require("express");
const Promise = require("bluebird");
const { json, urlencoded } = require("body-parser");

global.Promise = Promise;

const db = require("./db.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(require("./routes.js"));

Promise.resolve(db).then(() => {
  console.log("Now listening on", port);
  app.listen(port);
});
