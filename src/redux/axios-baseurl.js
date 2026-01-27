import axios from "axios";
import { toast } from "react-hot-toast";

const client = axios.create(
  {
    baseURL: import.meta.env.VITE_BASE_URL + "/api/admin",
    withCredentials: true,
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 429) {
        toast.error("Too many requests from this IP, please try again later.");
      } 
    } else if (error.request) {
      toast.error("No response from server. Please check your connection.");
    } else {
      toast.error("Error: " + error.message);
    }

    return Promise.reject(error);
  }
);

export default client;

export const reCapchaMatching = async (value) => {
  try {
    const response = await client.post("/verify-recapcha", value);
    return response.data;
  } catch (error) {
    return error;
  }
};
