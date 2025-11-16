import {useQuery} from "@tanstack/react-query";
import {appAxios} from "../api";
import {User} from "../models/User.ts";

export const useUserQuery = () => {
    return useQuery({
        queryKey: ['getCurrentUser'],
        queryFn: async (): Promise<User> => {
            const res = await appAxios.get('/api/users/me')
            return res.data;
        }
    })
}