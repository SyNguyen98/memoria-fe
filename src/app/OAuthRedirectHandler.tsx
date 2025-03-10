import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "@tanstack/react-query";
import {useAppDispatch} from "./hook.ts";
import {CookieUtil} from "../utils/CookieUtil.ts";
import {CookieKey} from "../constants/Storage.ts";
import {appAxios} from "../api";
import {openSnackbar} from "../reducers/SnackbarReducer.ts";
import AppLoader from "../components/app-loader/AppLoader.tsx";

export default function OAuthRedirectHandler() {
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const queryClient = useQueryClient();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            CookieUtil.setCookie(CookieKey.ACCESS_TOKEN, `Bearer ${token}`, 1);

            appAxios.defaults.headers.Authorization = `Bearer ${token}`;

            queryClient.invalidateQueries({queryKey: ["getCurrentUser"]}).then(() => {
                const lastPath = localStorage.getItem("lastPath");
                navigate(lastPath ? lastPath : "/map");
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: t("user.cannot_load")}));
            })
        }
    }, [dispatch, navigate, queryClient, searchParams, t]);

    return <AppLoader/>;
}