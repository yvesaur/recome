require("dotenv").config();

const express = require("express");
const cors = require("cors");
const newsRoutes = require("./routes/newsRoutes");
const accountRoutes = require("./routes/accountRoutes");
const behaviourRoutes = require("./routes/behavioursRoutes");
const generateRandomAuthorName = require("./utils/getAuthor");
const getRandomDate = require("./utils/getDate");

const app = express();
const port = process.env.PORT || 5001;

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
/* ========== */

/* ROUTES */
app.use("/", newsRoutes);
app.use("/", accountRoutes);
app.use("/", behaviourRoutes);
/* ====== */

// Example usage

/* SERVER */
app.listen(port, () => {
  console.log(`SERVER IS UP AND LISTENING ON PORT: ${port}`);
});
/* ====== */
