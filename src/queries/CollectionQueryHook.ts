import {AxiosHeaders} from "axios";
import {useMutation, useQuery} from "@tanstack/react-query";
import {appAxios} from "../api";
import {Collection} from "../models/Collection.ts";

const API_URL = '/api/collections';

export type CollectionApiParams = {
    page?: number;
    size?: number;
    sort?: string;
    unpaged?: boolean;
    tags?: string;
}

export const useCollectionQuery = (params: CollectionApiParams) => {
    if (params.sort === undefined) {
        params.sort = 'lastModifiedDate,desc';
    }
    return useQuery({
        queryKey: ['getAllCollectionsHavingAccess', params],
        queryFn: async (): Promise<{ header: AxiosHeaders, data: Collection[] }> => {
            const res = await appAxios.get(API_URL, {params});
            return {
                header: res.headers as AxiosHeaders,
                data: res.data
            };
        }
    })
}

export const useCollectionByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ['getCollectionById', id],
        queryFn: async (): Promise<Collection> => {
            const res = await appAxios.get(`${API_URL}/${id}`);
            return res.data;
        }
    })
}

export const useCollectionByLocationIdQuery = (locationId: string) => {
    return useQuery({
        queryKey: ['getCollectionByLocationId', locationId],
        queryFn: async (): Promise<Collection> => {
            const res = await appAxios.get(`${API_URL}/locations/${locationId}`);
            return res.data;
        },
        enabled: locationId !== ''
    })
}

export const useUserEmailsCollectionQuery = () => {
    return useQuery({
        queryKey: ['getAllUserEmailsOfCollection'],
        queryFn: async (): Promise<string[]> => {
            const res = await appAxios.get(`${API_URL}/user-emails`);
            return res.data;
        }
    })
}

export const useYearsOfCollectionQuery = () => {
    return useQuery({
        queryKey: ['getAllYearsOfCollection'],
        queryFn: async (): Promise<number[]> => {
            const res = await appAxios.get(`${API_URL}/years`);
            return res.data;
        }
    })
}

export const useCreateCollectionMutation = (onSuccess: () => void, onError: () => void) => {
    return useMutation({
        mutationKey: ['createCollection'],
        mutationFn: async (collection: Collection): Promise<Collection> => {
            const res = await appAxios.post(API_URL, collection);
            return res.data;
        },
        onSuccess,
        onError
    });
}

export const useUpdateCollectionMutation = (onSuccess: () => void, onError: () => void) => {
    return useMutation({
        mutationKey: ['updateCollection'],
        mutationFn: async (collection: Collection): Promise<Collection> => {
            const res = await appAxios.put(`${API_URL}/${collection.id}`, collection);
            return res.data;
        },
        onSuccess,
        onError
    });
}

export const useDeleteCollectionMutation = (onSuccess: () => void, onError: () => void) => {
    return useMutation({
        mutationKey: ['deleteCollection'],
        mutationFn: (id: string): Promise<void> => {
            return appAxios.delete(`${API_URL}/${id}`);
        },
        onSuccess,
        onError
    });
}