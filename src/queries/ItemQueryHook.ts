import {useQuery} from "@tanstack/react-query";
import {appAxios} from "../api";
import {Item} from "../models/Item.ts";

const API_URL = '/api/items';

export const useItemQuery = (locationId: string, thumbnailSize?: "large" | "medium" | "small") => {
    return useQuery({
        queryKey: ['getAllItemsByLocationId', locationId, thumbnailSize],
        queryFn: async (): Promise<Item[]> => {
            const res = await appAxios.get(API_URL, {params: { locationId, thumbnailSize }});
            return res.data;
        },
        enabled: locationId !== ""
    })
}
