import axios from "axios";

const instance = axios.create({
  baseURL: "https://reminder-go-deployment-bk4spykuta-uc.a.run.app",
});

export default instance;
