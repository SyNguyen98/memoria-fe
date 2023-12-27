import {appAxios} from "./index";
import {BACKEND_URL} from "../constants/Url";
import {Collection} from "../models/Collection";

const API_URL = `${BACKEND_URL}/api/collections`;

export class CollectionApi {

    static async getCollectionById(id: string): Promise<Collection> {
        return appAxios.get(`${API_URL}/${id}`).then(res => res.data);
    }

    static async getAllCollectionsByOwner(): Promise<Collection[]> {
        return appAxios.get(API_URL).then(res => res.data);
    }

    static async getAllCollectionsHavingAccess(): Promise<Collection[]> {
        const res = await appAxios.get(`${API_URL}/all`);
        return res.data;
    }

    static async createCollection(collection: Collection): Promise<Collection> {
        const res = await appAxios.post(API_URL, collection);
        return res.data;
    }

    static async updateCollection(collection: Collection): Promise<Collection> {
        const res = await appAxios.put(API_URL, collection);
        return res.data;
    }

    static async deleteCollectionById(id: string): Promise<void> {
        await appAxios.delete(`${API_URL}/${id}`);
    }
}
