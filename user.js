const dbPromise = require("./db.js");
const sql = require("sql-template-strings");
const bcrypt = require("bcrypt");

module.exports = {
  register: async ({ username, password, organization }) => {
    const db = await dbPromise;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(sql`INSERT INTO users (username, password, organization) VALUES (
      ${username},
      ${hashedPassword},
      ${organization}
    )`);
  },

  login: async ({ username, password }) => {
    const db = await dbPromise;
    const ret = await db.get(
      sql`SELECT * FROM users WHERE username = ${username}`
    );
    if (ret == null) {
      throw new Error("Invalid username");
    }

    const { id, password: hashedPassword } = ret;

    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
      const token = require("crypto")
        .randomBytes(24)
        .toString("hex");
      await db.run(sql`INSERT INTO sessions VALUES (
        ${token},
        ${id}
      )`);
      return {
        token,
        user: {
          username: ret.username,
          organization: ret.organization,
          widgets: ret.widgets.split("|").filter(Boolean)
        }
      };
    }

    throw new Error("Invalid password");
  },

  logout: async userID => {
    const db = await dbPromise;
    await db.run(sql`DELETE FROM sessions WHERE user = ${userID}`);
  },

  getAllProperties: async userID => {
    const db = await dbPromise;

    return await db.all(
      sql`SELECT * FROM properties
          LEFT JOIN user_properties ON
            properties.id = user_properties.property
          WHERE user_properties.user = ${userID}`
    );
  },

  addProperty: async (userID, property) => {
    const db = await dbPromise;
    const ret = await db.run(sql`INSERT INTO properties (
      address,
      city,
      state,
      zipcode,
      bedrooms,
      bathrooms,
      age,
      picture,
      sqFt,
      lotSize,
      hoa,
      type,
      onMarket,
      mode
    )
    VALUES (
      ${property.address},
      ${property.city},
      ${property.state},
      ${property.zipcode},
      ${property.bedrooms},
      ${property.bathrooms},
      ${property.age},
      ${property.picture},
      ${property.sqFt},
      ${property.lotSize},
      ${property.hoa},
      ${property.type},
      ${property.onMarket},
      ${property.mode}
    )`);

    if (ret.lastID) {
      await db.run(
        sql`INSERT INTO user_properties VALUES (${userID}, ${ret.lastID})`
      );
    } else {
      throw new Error("Adding property failed");
    }

    return ret.lastID;
  },

  updateWidgets: async (userID, widgets) => {
    const db = await dbPromise;
    const widgetString = widgets.join("|");
    await db.run(
      sql`UPDATE users SET widgets = ${widgetString} WHERE id = ${userID}`
    );
  }
};
