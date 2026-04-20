import config from "@/app/config";
import axios from "axios";


const API_URL = config.API_URL;

console.log("api called: ", API_URL);

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            error.response.data.message === "Token expired" &&
            !originalRequest._retry
            
        ) 
        {
            console.log('error.response.status :', error.response.status);
            originalRequest._retry = true;

            try {
                const token = localStorage.getItem("accessToken");
                console.log('token :', token);
                // const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTliYmZjMC05OTY3LTc3NjktOTUzOS0xOTdhYjc2ZDVhZTIiLCJpYXQiOjE3Njg2NDI0MzcsImV4cCI6MTc2OTI0NzIzN30.KiRtoYfz-2VbirUdL6UYCgkJ30iJH3UYoRbfGkMJ8EU"
                const { data } = await axios.post(
                    `http://192.168.1.214:3000/api/auth/user/refresh`,
                    {},

                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "x-client-platform": "web",
                        },
                    } 
                );
                console.log("data : ", data);

                localStorage.setItem("accessToken", data.metadata.accessToken);

                api.defaults.headers["Authorization"] = `Bearer ${data.metadata.accessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${data.metadata.accessToken}`;
                return api(originalRequest);
            } catch (error) {
                console.error("lỗi RFToken", error);
                localStorage.removeItem("accessToken");
                // window.location.href = "/login";
            }
        }
        return Promise.reject(formatError(error));
    }
);

const formatError = (error: any) => {
    if (error?.response) {
        const { status, data } = error.response;

        return {
            status,
            type: data?.type || "error",
            message: data?.message || "Đã xảy ra lỗi",
            errCode: data?.errCode ?? -1,
        };
    } 

    return {
        status: 500,
        type: "error",
        message: "Lỗi kết nối server",
        errCode: -1,
    };
};

/* ===== GET ===== */
export const get = async <T = any>(endpoint: string, config?: any): Promise<T> => {
    const { data } = await api.get(endpoint, config);
    return data;
};

/* ===== POST ===== */
export const post = async <T = any>(endpoint: string, body?: any, config?: any): Promise<T> => {
    const { data } = await api.post(endpoint, body, config);
    return data;
};

/* ===== PUT / UPDATE ===== */
export const put = async <T = any>(endpoint: string, body?: any, config?: any): Promise<T> => {
    const { data } = await api.put(endpoint, body, config);
    return data;
};

/* ===== DELETE ===== */
export const del = async <T = any>(endpoint: string, config?: any): Promise<T> => {
    const { data } = await api.delete(endpoint, config);
    return data;
};
