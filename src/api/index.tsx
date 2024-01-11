import axios from "axios";
import {BACKEND_URL} from "../constants/Url.ts";

export const appAxios = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})