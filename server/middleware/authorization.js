const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Not Authorize");
    }

    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = payload.user;

    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json("Not Authorize");
  }
};
