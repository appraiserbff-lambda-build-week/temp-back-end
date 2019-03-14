const sqlite = require("sqlite");
const Promise = require("bluebird");

module.exports = Promise.resolve()
  .then(() => sqlite.open("./database.sqlite", { Promise, verbose: true }))
  .then(db => db.migrate());
