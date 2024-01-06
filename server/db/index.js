const { Pool } = require("pg");
const fs = require("fs");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

console.log("PGUSER: ", process.env.PGUSER);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
