import {AxiosHeaders} from "axios";
import {useMutation, useQuery} from "@tanstack/react-query";
import {appAxios} from "../api";
import {Location} from "../models/Location.ts";

const API_URL = '/api/locations';

export const useAllLocationsQuery = (collectionId: string, year: string) => {
    const params: Record<string, string> = { collectionId, year };
    if (!collectionId || collectionId === "all") delete params.collectionId;
    if (!year || year === "all") delete params.year;
    return useQuery({
        queryKey: ['getAllLocationsByParams', collectionId, year],
        queryFn: async (): Promise<Location[]> => {
            const res = await appAxios.get(`${API_URL}/all`, { params });
            return res.data;
        },
        enabled: appAxios.defaults.headers.Authorization !== undefined
    })
}

export const usePagingLocationQuery = (collectionId: string, page: number, size: number) => {
    return useQuery({
        queryKey: ['getPagingLocationsByParams', collectionId, page, size],
        queryFn: async (): Promise<{ header: AxiosHeaders, data: Location[] }> => {
            const res = await appAxios.get(API_URL, {
                params: {
                    collectionId, page, size,
                    sort: 'takenYear,desc,takenMonth,desc,takenDay,desc,takenTime,desc'
                }
            });
            return {
                header: res.headers as AxiosHeaders,
                data: res.data
            };
        },
        enabled: appAxios.defaults.headers.Authorization !== undefined
    })
}

export const useLocationByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['getLocationById', id],
        queryFn: async (): Promise<Location> => {
            const res = await appAxios.get(`${API_URL}/${id}`);
            return res.data;
        },
        enabled: id !== undefined && id !== "" && appAxios.defaults.headers.Authorization !== undefined
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
            const res = await appAxios.put(`${API_URL}/${location.id}`, location);
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