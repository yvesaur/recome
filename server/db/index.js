const { Pool } = require("pg");
const fs = require("fs");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem").toString(),
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
