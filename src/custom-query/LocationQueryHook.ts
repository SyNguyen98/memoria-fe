import {AxiosHeaders} from "axios";
import {useMutation, useQuery} from "@tanstack/react-query";
import {appAxios} from "../api";
import {Location} from "../models/Location.ts";

const API_URL = '/api/locations';

export const useLocationQuery = (collectionId: string, page: number, size: number) => {
    return useQuery({
        queryKey: ['getAllLocationsByCollectionId', collectionId, page, size],
        queryFn: async (): Promise<{ header: AxiosHeaders, data: Location[] }> => {
            const res = await appAxios.get(API_URL, {params: {collectionId, page, size}});
            return {
                header: res.headers as AxiosHeaders,
                data: res.data
            };
        },
        enabled: collectionId !== undefined && collectionId !== "" && appAxios.defaults.headers.Authorization !== undefined
    })
}

export const useCreateLocationMutation = (onSuccess: () => void, onError: () => void) => {
    return useMutation({
        mutationKey: ['createLocation'],
        mutationFn: async (location: Location): Promise<Location> => {
            const res = await appAxios.post(API_URL, location);
            return res.data;
        },
        onSuccess,
        onError
    });
}

export const useUpdateLocationMutation = (onSuccess: () => void, onError: () => void) => {
    return useMutation({
        mutationKey: ['updateLocation'],
        mutationFn: async (location: Location): Promise<Location> => {
            const res = await appAxios.put(API_URL, location);
            return res.data;
        },
        onSuccess,
        onError
    });
}

export const useDeleteLocationMutation = () => {
    return useMutation({
        mutationKey: ['deleteLocationById'],
        mutationFn: (id: string): Promise<void> => {
            return appAxios.delete(`${API_URL}/${id}`);
        },
    });
}