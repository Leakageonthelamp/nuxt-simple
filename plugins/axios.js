/* eslint-disable */
export default function ({ $axios, redirect }) {
  // Adds header: `Content-Type: application/x-www-form-urlencoded` to only post requests
  $axios.setHeader("Content-Type", "application/json");
  $axios.setHeader("Access-Control-Allow-Origin", "*");
  $axios.setHeader("X-Requested-With", "XMLHttpRequest");

  $axios.onRequest(() => {
    // console.log('Making request to ' + config.url)
  });

  $axios.onError((error) => {
    return error;
  });
}
