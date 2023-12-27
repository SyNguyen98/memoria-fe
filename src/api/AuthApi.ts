import {appAxios} from "./index";
import {BACKEND_URL} from "../constants/Url";

const API_URL = `${BACKEND_URL}/memoria/microsoft`;

export class AuthApi {

    static async getMicrosoftTokenAvailable(): Promise<any> {
        return appAxios.get(`${API_URL}/token`).then(res => res.data);
    }

    static async sendAuthorizeCode(code: string): Promise<void> {
        return appAxios.get(`${API_URL}/oauth2?code=${code}`).then();
    }
}
