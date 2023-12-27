import axios from "axios";

export const appAxios = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})