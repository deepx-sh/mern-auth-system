import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const apiClient = axios.create({
    baseURL: apiBaseURL,
    withCredentials:true
});

export default apiClient