import {useMutation, useQuery} from "@tanstack/react-query";
import {appAxios} from "../api";
import {Collection} from "../models/Collection.ts";

export const useCollectionQuery = () => {
    return useQuery({
        queryKey: ['getAllCollectionsHavingAccess'],
        queryFn: async (): Promise<Collection[]> => {
            const res = await appAxios.get('/api/collections');
            return res.data;
        }
    })
}

export const useCreateCollectionMutation = (onSuccess: () => void, onError: () => void) => {
    return useMutation({
        mutationKey: ['createCollection'],
        mutationFn: async (collection: Collection): Promise<Collection> => {
            const res = await appAxios.post('/api/collections', collection);
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
            const res = await appAxios.put('/api/collections', collection);
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
            return appAxios.delete(`/api/collections/${id}`);
        },
        onSuccess,
        onError
    });
}