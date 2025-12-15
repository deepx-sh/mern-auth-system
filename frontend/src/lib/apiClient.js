import axios from "axios";
import {toast} from 'react-toastify'
const apiBaseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const apiClient = axios.create({
    baseURL: apiBaseURL,
    withCredentials:true
});


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = [];
}

const handleSessionExpiry = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("pendingEmail");
    localStorage.removeItem("resetEmail");
    localStorage.removeItem("resetToken")
    const currPath = window.location.pathname;

    const publicPaths = ["/login", "/register", "/forgot-password", "/verify-email", "/verify-reset-otp", "/reset-password","/"];

    if (!publicPaths.includes(currPath)) {
        toast.error("Your session has expired. Please login again",{toastId:'session-expired'})
    }

     setTimeout(() => {
                        window.location.href="/login"
                    },3000)
}

const NO_REFRESH_ENDPOINTS=["/auth/login","/auth/register","/auth/verify-otp","/auth/forget-password","/auth/verify-reset-otp","/auth/reset-password","/auth/refresh-token","/auth/resend-verify-otp"]
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {

        // Handle Rate limit error
        if (error.response?.status === 429) {
            const errorData = error.response.data;
            const retryAfter = errorData.retryAfter;

            if (retryAfter) {
                const minutes = Math.ceil(retryAfter / 60);
                toast.error(`${errorData.message}. Try again in ${minutes} minutes`),{autoClose:5000}
            } else {
                toast.error(errorData.message || "Too many requests. Please try again later")
            }

            return Promise.reject(error)
        }
        const originalReq = error.config;
        console.log(error);
        console.log(originalReq);
        
        // if (originalReq.url.includes("/auth/refresh-token")) {
        //     return Promise.reject(error)
        // }
        const shouldSkipRefresh = NO_REFRESH_ENDPOINTS.some(endpoint => originalReq.url?.includes(endpoint));
        if (error.response?.status === 401 && !originalReq._retry && !shouldSkipRefresh) {

            const errorMessage = error.response?.data?.message || "";
            const isTokenExpiry = errorMessage.includes("token expired") || errorMessage.includes("Access token expired") || errorMessage.includes("Unauthorized access") || errorMessage.includes("Invalid access token");

            if (!isTokenExpiry) {
                return Promise.reject(error)
            }
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve,reject})
                })
                    .then(() => {
                    return apiClient(originalReq)
                    })
                    .catch((err) => {
                    return Promise.reject(err)
                })
            }

            originalReq._retry = true;
            isRefreshing = true
            
            try {
                console.log("Im");
                
                await apiClient.post("/auth/refresh-token")
                processQueue(null)
                isRefreshing = false
                return apiClient(originalReq)
            } catch (refreshError) {
                console.log("Im in catch");
                
                processQueue(refreshError, null)
                isRefreshing = false
                
                console.error("Refresh token failed");
                const errorMsg = refreshError.response?.data?.message || "";

                if (errorMsg.includes("expired") || errorMsg.includes("Session expired") || refreshError.response?.status === 401) {
                    handleSessionExpiry();
                }
                // localStorage.removeItem("userData")
                
                
                // const currPath = window.location.pathname;
                // if (!["/login", "/register","/forgot-password","/verify-email","/verify-reset-otp","reset-password"].includes(currPath)) {
                //     toast.error("Session expired. Please login again")

                //     setTimeout(() => {
                //         window.location.href="/login"
                //     },1000)
                // }
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)
export default apiClient