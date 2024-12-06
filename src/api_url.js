// const img_url = "https://backendpickmeuptrial-production.up.railway.app";
const img_url = process.env.REACT_APP_API_URL;
const API_URL = img_url + "/api/user/";

export { API_URL, img_url };