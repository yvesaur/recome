require("dotenv").config();

const express = require("express");
const cors = require("cors");
const newsRoutes = require("./routes/newsRoutes");

const app = express();
const port = process.env.PORT || 5001;

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
/* ========== */

/* ROUTES */
app.use("/", newsRoutes);
/* ====== */

/* SERVER */
app.listen(port, () => {
  console.log(`SERVER IS UP AND LISTENING ON PORT: ${port}`);
});
/* ====== */
