import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:3001" // API's base URL
});

instance.interceptors.request.use(
  (config: any) => {
    // get the auth token from cookies
    const token = Cookies.get("token");

    // if the token is present, set it on the request headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default instance;