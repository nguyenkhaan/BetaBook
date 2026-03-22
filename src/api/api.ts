import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // đổi theo backend của bạn
  timeout: 10000 
});

export default api;