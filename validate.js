const dbPromise = require("./db.js");
const sql = require("sql-template-strings");

module.exports = async function validate(req, res, next) {
  const db = await dbPromise;
  const { token } = req.body;
  const user = await db.get(sql`SELECT user FROM sessions WHERE id = ${token}`);
  if (user) {
    req.user = user.user;
    return next();
  }
  next(new Error("User is not logged in"));
};
