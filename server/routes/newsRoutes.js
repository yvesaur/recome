const express = require("express");
const router = express.Router();
const db = require("../db");
const axios = require("axios");

router.get("/api/v1/news", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM news LIMIT 5");

    res.status(200).json({
      status: "success",
      results: 1,
      data: {
        news: response.rows,
      },
      message: "News data fetched successfuly.",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching news data.",
    });
  }
});

router.get("/api/v1/behaviours", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/v1/getNewsData"
    );

    // console.log(response.data[0]);

    res.status(200).json({
      status: "success",
      results: 1,
      data: response.data,
      message: "Behaviours data fetched successfuly.",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching behaviours data.",
    });
  }
});

module.exports = router;
