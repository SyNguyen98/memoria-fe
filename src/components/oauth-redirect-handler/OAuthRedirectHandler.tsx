import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "@tanstack/react-query";
import {CookieUtil} from "@utils/CookieUtil.ts";
import {CookieKey} from "@constants/Storage.ts";
import {appAxios} from "../../api";
import AppLoader from "../app-loader/AppLoader.tsx";
import {useAppSnackbarContext} from "@providers/AppSnackbar.tsx";

export default function OAuthRedirectHandler() {
    const [searchParams] = useSearchParams();
    const {openSnackbar} = useAppSnackbarContext();
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
                openSnackbar("error", t("user.cannot_load"));
            })
        }
    }, [navigate, openSnackbar, queryClient, searchParams, t]);

    return <AppLoader/>;
}