import {appAxios} from "./index";
import {BACKEND_URL} from "../constants/Url";
import {Item} from "../models/Item";

const API_URL = `${BACKEND_URL}/api/items`;

export class ItemApi {

    static async getAllItemsByDriveItemId(driveItemId: string, thumbnailSize?: "large" | "medium" | "small"): Promise<Item[]> {
        const res = await appAxios.get(API_URL, {params: { driveItemId, thumbnailSize }});
        return res.data;
    }

    static async getItemsByItemId(itemId: string): Promise<Item> {
        const res = await appAxios.get(`${API_URL}/${itemId}`);
        return res.data;
    }
}
