-- Up

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,
  organization TEXT,
  widgets TEXT NOT NULL DEFAULT ''
);
CREATE TABLE properties (
  id INTEGER PRIMARY KEY,
  address TEXT,
  city TEXT,
  state TEXT,
  zipcode TEXT,
  bedrooms INT,
  bathrooms INT,
  age INT,
  picture TEXT,
  zestimate INT,
  sqFt INT,
  lotSize INT,
  hoa INT,
  type TINYINT,
  onMarket INT,
  mode TEXT
);
CREATE TABLE user_properties (
  user INTEGER,
  property INTEGER,
  FOREIGN KEY(user) REFERENCES users(id),
  FOREIGN KEY(property) REFERENCES properties(id)
);
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user INTEGER UNIQUE ON CONFLICT REPLACE,
  FOREIGN KEY(user) REFERENCES users(id)
);


-- Down

DROP TABLE users;
DROP TABLE properties;
DROP TABLE sessions;
DROP TABLE user_properties;
