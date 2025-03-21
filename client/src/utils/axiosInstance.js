import axios from "axios";
const axiosInstance = axios.create({
    baseURL: "http://localhost:5134/api",
    withCredentials: true,
});

export default axiosInstance;
