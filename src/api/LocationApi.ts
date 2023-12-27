import {appAxios} from "./index";
import {BACKEND_URL} from "../constants/Url";
import {Location} from "../models/Location";
import {Collection} from "../models/Collection";

const API_URL = `${BACKEND_URL}/api/locations`;

export class LocationApi {

    static async getAllLocationsByCollectionId(collectionId: string): Promise<Location[]> {
        return appAxios.get(API_URL, { params: { collectionId }}).then(res => res.data);
    }

    static async createLocation(location: Location): Promise<Location> {
        const res = await appAxios.post(API_URL, location);
        return res.data;
    }

    static async updateLocation(location: Location): Promise<Location> {
        const res = await appAxios.put(API_URL, location);
        return res.data;
    }
}
