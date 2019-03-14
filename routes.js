const express = require("express");
const router = express.Router();

const user = require("./user.js");
const validate = require("./validate.js");

router.get("/", async (req, res) => {
  res.send("I am alive");
});

router.post(
  "/register",
  async ({ body: { username, password, organization } }, res, next) => {
    try {
      await user.register({
        username,
        password,
        organization
      });
      res.send("OK");
    } catch (e) {
      next(e);
    }
  }
);

router.post("/login", async ({ body: { username, password } }, res, next) => {
  try {
    const token = await user.login({
      username,
      password
    });
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

router.post("/logout", validate, async ({ body: { token } }, res, next) => {
  try {
    await user.logout(token);
    res.send();
  } catch (e) {
    next(e);
  }
});

router.post("/properties/add", validate, async (req, res, next) => {
  try {
    const id = await user.addProperty(req.user, req.body);
    res.json({ id });
  } catch (e) {
    next(e);
  }
});

router.post("/properties", validate, async (req, res, next) => {
  try {
    const properties = await user.getAllProperties(req.user);
    res.json(properties);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
