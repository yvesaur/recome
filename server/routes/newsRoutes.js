const express = require("express");
const router = express.Router();
const db = require("../db");
const axios = require("axios");
const { Pool } = require("pg");

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

router.get("/api/v1/news/:id", async (req, res) => {
  try {
    const reqID = req.params.id;
    const getSingleNewsData = await db.query(
      "SELECT * FROM news WHERE id = ($1)",
      [reqID]
    );

    res.status(200).json({
      status: "success",
      results: 1,
      data: {
        news: getSingleNewsData.rows[0],
      },
      message: "News Data got successfully",
    });
  } catch (error) {
    console.error(error.message);

    console.log("REQUEST FAILED: ", req.params);
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving a news",
    });
  }
});

router.get("/api/v1/news/related/:id", async (req, res) => {
  try {
    const reqID = req.params.id;
    const relatedNewsID = await axios.get(
      `http://localhost:8000/api/v1/getRecommendedNews/${reqID}`
    );

    const response = await db.query(
      "SELECT * FROM news WHERE id IN (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8))",
      [
        relatedNewsID.data[0],
        relatedNewsID.data[1],
        relatedNewsID.data[2],
        relatedNewsID.data[3],
        relatedNewsID.data[4],
        relatedNewsID.data[5],
        relatedNewsID.data[6],
        relatedNewsID.data[7],
      ]
    );

    res.status(200).json({
      status: "success",
      results: response.rows.length,
      data: { news: response.rows },
      message: "Related News data fetched successfuly.",
    });
  } catch (error) {
    console.error(error.message);

    console.log("REQUEST FAILED: ", req.params);
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving a related news.",
    });
  }
});

router.get("/api/v1/getTrendingNews", async (req, res) => {
  try {
    const trendingNewsID = await axios.get(
      "http://localhost:8000/api/v1/getTrendingNews"
    );

    const response = await db.query(
      "SELECT * FROM news WHERE id IN (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8))",
      [
        trendingNewsID.data.itemId[0],
        trendingNewsID.data.itemId[1],
        trendingNewsID.data.itemId[2],
        trendingNewsID.data.itemId[3],
        trendingNewsID.data.itemId[4],
        trendingNewsID.data.itemId[5],
        trendingNewsID.data.itemId[6],
        trendingNewsID.data.itemId[7],
      ]
    );

    res.status(200).json({
      status: "success",
      results: response.rows.length,
      data: { news: response.rows },
      message: "Trending News data fetched successfuly.",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching Trending news data.",
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
