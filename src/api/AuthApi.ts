import {appAxios} from "./index";

const API_URL = '/memoria/microsoft';

export class AuthApi {

    static async getMicrosoftTokenAvailable(): Promise<any> {
        return appAxios.get(`${API_URL}/token`).then(res => res.data);
    }

    static async sendAuthorizeCode(code: string): Promise<void> {
        return appAxios.get(`${API_URL}/oauth2?code=${code}`).then();
    }
}
