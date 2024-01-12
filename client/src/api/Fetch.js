import axios from "axios";

/*
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://recome.news/api/v1"
    : "https://recome.news/api/v1";
*/

const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:5000/api/v1"
    : "http://localhost:5000/api/v1";

export default axios.create({
  baseURL,
});
