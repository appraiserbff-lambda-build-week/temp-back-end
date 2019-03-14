const express = require("express");
const router = express.Router();

const user = require("./user.js");
const validate = require("./validate.js");
const { estimate, altEstimate } = require("./price-estimator.js");

/* TO DO: 
  update account settings: username, password, organization
  delete a property by id
*/

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
      res.json({ status: "ok" });
    } catch (e) {
      next(e);
    }
  }
);

router.post("/login", async ({ body: { username, password } }, res, next) => {
  try {
    const userData = await user.login({
      username,
      password
    });
    res.json(userData);
  } catch (e) {
    next(e);
  }
});

router.post("/logout", validate, async (req, res, next) => {
  try {
    await user.logout(req.user);
    res.json({ status: "ok" });
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
    let properties = await user.getAllProperties(req.user);

    properties = await Promise.all(
      properties.map(async property => {
        try {
          const zestimate = property.yearAssessed // if year exists
            ? await estimate(property) 
            : await altEstimate(property);
          property.zestimate = parseInt(zestimate.replace("$", ""), 10);
        } catch (e) {
          console.log(e);
        }

        return property;
      })
    );
    res.json(properties);
  } catch (e) {
    next(e);
  }
});

router.post("/user/update-widgets", validate, async (req, res, next) => {
  try {
    await user.updateWidgets(req.user, req.body.widgets);
    res.json({ status: "ok" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
