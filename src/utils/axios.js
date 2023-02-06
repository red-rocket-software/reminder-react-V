import axios from "axios";

const instance = axios.create({
  baseURL: "https://reminder-api-oz2kvyderq-uc.a.run.app/",
});

export default instance;
