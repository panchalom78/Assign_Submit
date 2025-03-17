import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5134/api",
});

export default axiosInstance;
