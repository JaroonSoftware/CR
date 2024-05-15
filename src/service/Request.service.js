import axios from "axios"; 
import { BACKEND_URL } from "../utils/util";
import {  message } from 'antd';
// import { Authenticate } from "./Authenticate.service"; 
// const [messageApi] = message.useMessage();
// const auThen = Authenticate();
export const requestService = axios.create({
    baseURL: BACKEND_URL, 
}); 

requestService.interceptors.request.use(
    (config) => {
      // const token = auThen.getToken();
      let token = sessionStorage.getItem("authen");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['Content-Type'] = "application/x-www-form-urlencoded";
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

requestService.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        delete axios.defaults.headers.common["Authorization"];
        console.warn(error);
        message.error(error.response?.message || "Token epired");
      }
      
      return Promise.reject(error);
    }
  );

export const getParmeter = (p)=> ( Object.keys(p).map( n => `${n}=${p[n]}`) ).join("&");

export default requestService;