const express = require("express");
const router = express.Router();
const db = require("../db");
const axios = require("axios");

router.get("/api/v1/news", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/v1/getNewsData"
    );

    // console.log(response.data[0]);

    res.status(200).json({
      status: "success",
      results: 1,
      data: response.data,
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
      "http://localhost:8000/api/v1/getBehavioursData"
    );

    // console.log(response.data[0]);

    res.status(200).json({
      status: "success",
      results: 1,
      data: {
        id: response.data[0][0],
        userid: response.data[0][1],
        timestamp: response.data[0][2],
        click_history: response.data[0][3],
        impressions: response.data[0][4],
      },
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
