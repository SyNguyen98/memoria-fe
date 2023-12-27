import {appAxios} from "./index";
import {BACKEND_URL} from "../constants/Url";
import {User} from "../models/User";

const API_URL = `${BACKEND_URL}/api/users`;

export class UserApi {

    static async getCurrentUser(): Promise<User> {
        const res = await appAxios.get(`${API_URL}/me`)
        return res.data;
    }
}
