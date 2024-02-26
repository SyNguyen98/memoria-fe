import {useQuery} from "@tanstack/react-query";
import {appAxios} from "../api";
import {Item} from "../models/Item.ts";

const API_URL = '/api/items';

export const useItemQuery = (driveItemId: string, thumbnailSize?: "large" | "medium" | "small") => {
    return useQuery({
        queryKey: ['getAllItemsByDriveItemId', driveItemId, thumbnailSize],
        queryFn: async (): Promise<Item[]> => {
            const res = await appAxios.get(API_URL, {params: { driveItemId, thumbnailSize }});
            return res.data;
        }
    })
}
