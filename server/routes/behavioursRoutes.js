const express = require("express");
const router = express.Router();
const db = require("../db");
const axios = require("axios");
const generateTimestamp = require("../utils/getTimestamp");

// ADD BEHAVIOUR
router.post("/api/v1/addBehaviour/:id", async (req, res) => {
  try {
    userid = req.params.id;
    timestamp = generateTimestamp().replace(",", "");

    const { click_history, impressions } = req.body;

    const id = await db.query("SELECT COUNT(id) from behaviours");
    const parseid = parseInt(id.rows[0].count) + 3;

    const addBehaviour = await db.query(
      `INSERT INTO 
        behaviours(id,userid,timestamp, click_history, impressions)
        VALUES($1,$2,$3,$4,$5)
        RETURNING * `,
      [parseid, userid, timestamp, click_history, impressions]
    );

    res.status(200).json({
      status: "success",
      results: 1,
      data: { behaviour: addBehaviour.rows[0] },
      message: "Behaviour Added successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while getting the user behaviour.",
    });
  }
});

// FETCH BEHAVIOURS
router.get("/api/v1/behaviours", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api1/v1/getNewsData"
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
