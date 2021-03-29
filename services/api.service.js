import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.globish.co.th"
    : "http://api.localhost:8080";

const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "X-Requested-With": "XMLHttpRequest"
};

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common = HEADERS;

export const postStudentInfo = async payload => {
  return await axios.post(`webhook/engder/score-history`, payload);
};

export const getStudentCourses = async email => {
  return await axios.get(`webhook/engder/courses`, { params: { email } });
};
