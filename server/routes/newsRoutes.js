const express = require("express");
const router = express.Router();
const db = require("../db");
const axios = require("axios");
const { Pool } = require("pg");
const generateRandomAuthorName = require("../utils/getAuthor");
const getRandomDate = require("../utils/getDate");

// DISPLAY LATEST NEWS
router.get("/api/v1/news", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT * FROM news5 WHERE date IS NOT NULL ORDER BY date DESC LIMIT 20"
    );

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

// DISPLAY ALL NEWS
router.get("/api/v1/fetchNews", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT * FROM news5 WHERE date IS NOT NULL ORDER BY date DESC"
    );

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

// DISPLAY ONE NEWS
router.get("/api/v1/news/:id", async (req, res) => {
  try {
    const reqID = req.params.id;
    const getSingleNewsData = await db.query(
      "SELECT * FROM news5 WHERE id = ($1)",
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

// DISPLAY RELATED NEWS
router.get("/api/v1/news/related/:id", async (req, res) => {
  try {
    const reqID = req.params.id;
    const relatedNewsID = await axios.get(
      `http://localhost:8000/api/v1/getRecommendedNews/${reqID}`
    );
    console.log(reqID);

    // Generate placeholders and parameters
    const placeholders = relatedNewsID.data
      .map((_, i) => `($${i + 1})`)
      .join(", ");
    const parameters = relatedNewsID.data;

    const response = await db.query(
      `SELECT * FROM news5 WHERE id IN (${placeholders})`,
      parameters
    );

    res.status(200).json({
      status: "success",
      results: response.rows.length,
      data: { news: response.rows },
      message: "Related News data fetched successfully.",
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

// DISPLAY USER RECOMMENDED NEWS
router.get("/api/v1/news/relatedusernews/:id", async (req, res) => {
  try {
    const userID = req.params.id;
    const userRecommendedNewsID = await axios.get(
      `http://localhost:8000/api/v1/getUserRecommendedNews/${userID}`
    );

    // Generate placeholders and parameters
    const placeholders = userRecommendedNewsID.data
      .map((_, i) => `($${i + 1})`)
      .join(", ");
    const parameters = userRecommendedNewsID.data;

    const response = await db.query(
      `SELECT * FROM news5 WHERE id IN (${placeholders})`,
      parameters
    );

    res.status(200).json({
      status: "success",
      results: response.rows.length,
      data: { news: response.rows },
      message: "User recommended news data fetched successfully.",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching User recommended news data.",
    });
  }
});

// DISPLAY TRENDING NEWS
router.get("/api/v1/getTrendingNews", async (req, res) => {
  try {
    const trendingNewsID = await axios.get(
      "http://localhost:8000/api/v1/getTrendingNews"
    );

    // Generate placeholders and parameters
    const placeholders = trendingNewsID.data.id
      .map((_, i) => `($${i + 1})`)
      .join(", ");
    const parameters = trendingNewsID.data.id;

    const response = await db.query(
      `SELECT * FROM news5 WHERE id IN (${placeholders})`,
      parameters
    );

    const newsClicks = trendingNewsID.data.n_click_training;

    res.status(200).json({
      status: "success",
      results: response.rows.length,
      data: { news: response.rows, newsClicks: newsClicks },
      message: "Trending News data fetched successfully.",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching Trending news data.",
    });
  }
});

// ADD NEWS AUTHOR
router.post("/api/v1/addAuthor", async (req, res) => {
  try {
    // Fetch all rows where the author is null
    const rows = await db.query(
      `
      SELECT *
      FROM news5
      WHERE author IS NULL
      `
    );

    // Generate a random author name for each row and update it
    for (let row of rows.rows) {
      const randomAuthorName = generateRandomAuthorName();

      await db.query(
        `
        UPDATE news1
        SET author = $1
        WHERE id = $2
        `,
        [randomAuthorName, row.id]
      );
    }

    res.status(200).json({
      status: "success",
      results: "SUCESS",
      message: "Authors added successfully.",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      status: "error",
      message: "An error occurred while adding authors data.",
    });
  }
});

// ADD NEWS DATE
router.post("/api/v1/addDate", async (req, res) => {
  try {
    // Fetch all rows where the author is null
    const rows = await db.query(
      `
      SELECT id
      FROM news5
      WHERE date IS NULL
      `
    );
    console.log(rows.rows.id);

    // Generate a random author name for each row and update it
    for (let row of rows.rows) {
      const randomDate = getRandomDate();

      await db.query(
        `
        UPDATE news1
        SET date = $1
        WHERE id = $2
        `,
        [randomDate, row.id]
      );
    }

    res.status(200).json({
      status: "success",
      results: "SUCESS",
      message: "Date added successfully.",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      status: "error",
      message: "An error occurred while adding date data.",
    });
  }
});

module.exports = router;
