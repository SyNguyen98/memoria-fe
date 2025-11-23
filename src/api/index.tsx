import axios from "axios";
import {BACKEND_URL} from "../constants/Url.ts";
import {CookieUtil} from "@utils/CookieUtil.ts";
import {CookieKey} from "@constants/Storage.ts";

export const appAxios = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

appAxios.interceptors.request.use(
    config => {
        config.headers.Authorization = CookieUtil.getCookie(CookieKey.ACCESS_TOKEN);
        return config;
    },
    error => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);