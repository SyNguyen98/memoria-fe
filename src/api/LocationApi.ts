import {appAxios} from "./index";
import {Location} from "../models/Location";

const API_URL = '/api/locations';

export class LocationApi {

    static async getAllLocationsByCollectionId(collectionId: string): Promise<Location[]> {
        return appAxios.get(API_URL, { params: { collectionId }}).then(res => res.data);
    }

    static async getLocationById(id: string): Promise<Location> {
        const res = await appAxios.get(`${API_URL}/${id}`);
        return res.data;
    }

    static async createLocation(location: Location): Promise<Location> {
        const res = await appAxios.post(API_URL, location);
        return res.data;
    }

    static async updateLocation(location: Location): Promise<Location> {
        const res = await appAxios.put(API_URL, location);
        return res.data;
    }

    static async deleteLocationById(id: string): Promise<void> {
        await appAxios.delete(`${API_URL}/${id}`);
    }
}
