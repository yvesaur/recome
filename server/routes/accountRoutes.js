const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validinfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// registering
router.post("/api/v1/auth/register", validinfo, async (req, res) => {
  try {
    // 1. Destructure
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      interest_areas,
      wide_interest,
      topic_exclusions,
      trending_news,
    } = req.body;

    // 1.1 Set the user ID
    const userid = await pool.query("SELECT COUNT(userid) from users");
    const ParUserid = `U${parseInt(userid.rows[0].count) + 100 + 1}`;

    // 2. Check if it exists
    const user = await pool.query("SELECT * FROM users WHERE email = ($1)", [
      email,
    ]);
    // res.json(user.rows);
    if (user.rows.length !== 0) {
      return res.status(401).json("USER ALREADY EXISTS!");
    }

    // 3. Bcrypt the password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Enter the new user to the database table
    const newUser = await pool.query(
      ` INSERT INTO 
            users (userid, username, firstName, lastName, email, password, interest_areas, wide_interest, topic_exclusions, trending_news) 
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) 
        RETURNING *`,
      [
        ParUserid,
        username,
        firstName,
        lastName,
        email,
        bcryptPassword,
        interest_areas,
        wide_interest,
        topic_exclusions,
        trending_news,
      ]
    );
    // res.json(newUser.rows[0]);

    // 5. Generate JWT Token
    const token = jwtGenerator(newUser.rows[0].userid);

    res.status(200).json({
      status: "success",
      results: 1,
      data: { token: token },
      message: "Account registered successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while registering your account.",
    });
  }
});

// login
router.post("/api/v1/auth/login", validinfo, async (req, res) => {
  try {
    // 1. Destructure
    const { email, password } = req.body;

    // 2. Check if doesn't exist
    const user = await pool.query("SELECT * FROM users WHERE email = ($1)", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // 3. chck if password is the same
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    console.log(validPassword);

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // 4. give them the jwt token
    const token = jwtGenerator(user.rows[0].userid);

    // 5. OUTPUT RESULT
    res.status(200).json({
      status: "success",
      results: 1,
      data: { token: token },
      message: "Logged In successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while logging in.",
    });
  }
});

// Verify User
router.get("/api/v1/auth/is-verify", authorization, async (req, res) => {
  {
    try {
      res.status(200).json({
        status: "success",
        data: true,
        message: "User verified successfully.",
      });
    } catch (error) {
      console.log(error.message);
      res.status(401).json({
        status: "error",
        message: "User not verified. Authentication failed.",
      });
    }
  }
});

// DISPLAY USER INFORMATION
router.get("/api/v1/getuserinfo", authorization, async (req, res) => {
  try {
    // res.json(req.user);

    const user = await pool.query(
      "SELECT userid,username,firstname,lastname,email,interest_areas,wide_interest,topic_exclusions,trending_news FROM users WHERE userid = ($1) ",
      [req.user]
    );

    res.status(200).json({
      status: "success",
      data: user.rows[0],
      message: "User Information fetched successfully.",
    });
  } catch (error) {
    console.error(error.message);
    res.status(401).json({
      status: "error",
      message: "User not verified. Getting user info failed.",
    });
  }
});

// UPDATE USER PREFERENCE
router.patch("/api/v1/user/editpreference/:id", async (req, res) => {
  const { id } = req.params;
  const { interest_areas, wide_interest, topic_exclusions, trending_news } =
    req.body;

  const updateUserPreference = await pool.query(
    `UPDATE users SET interest_areas = $1, wide_interest = $2, topic_exclusions = $3, trending_news = $4
       WHERE userid = $5 RETURNING *`,
    [interest_areas, wide_interest, topic_exclusions, trending_news, id]
  );

  res.status(200).json({
    status: "success",
    data: updateUserPreference.rows,
    message: "User Preference Updated successfully.",
  });

  try {
  } catch (error) {
    console.error(error.message);
    res.status(401).json({
      status: "error",
      message: "User not verified. Updating user preference failed.",
    });
  }
});

// GET USER CLICK HISTORY
router.get("/api/v1/getClickHistory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getClickHistory = await pool.query(
      `SELECT string_agg(click_history, ' ') as click_history 
       FROM (
         SELECT click_history 
         FROM behaviours 
         WHERE userid = '${id}' 
         ORDER BY TO_TIMESTAMP(timestamp, 'MM/DD/YYYY HH12:MI:SS AM') DESC
       ) sub`
    );

    // Convert the click_history string into an array
    const clickHistoryArrayParams = [
      ...new Set(getClickHistory.rows[0].click_history.split(" ")),
    ];

    const quotedParams = clickHistoryArrayParams
      .map((param) => `'${param}'`)
      .join(",");
    const response = await pool.query(
      `SELECT news.* 
         FROM unnest(ARRAY[${quotedParams}]) WITH ORDINALITY as t(id, ord) 
         JOIN news ON t.id = news.id 
         ORDER BY t.ord`
    );

    res.status(200).json({
      status: "success",
      data: {
        userClickedNews: response.rows,
        clickHistoryArrayParams: clickHistoryArrayParams,
      },
      message: "User clicked news fetched successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(401).json({
      status: "error",
      message: "An error occurred while fetching user clicked news",
    });
  }
});

module.exports = router;
