import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://recome.news/api/v1"
    : "https://recome.news/api/v1";

export default axios.create({
  baseURL,
});
