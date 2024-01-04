const { Pool } = require("pg");
const fs = require("fs");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem").toString(),
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
