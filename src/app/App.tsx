import './App.scss';
import React, {Fragment, useEffect} from 'react';
import {Route, Routes, useNavigate, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import i18n from "../translation/i18n.tsx";
import {useQueryClient} from "@tanstack/react-query";
import {useUserQuery} from "../custom-query/UserQueryHook.ts";
// Redux
import {useAppDispatch, useAppSelector} from "./hook";
import {setUser} from "../reducers/UserReducer";
import {openSnackbar} from "../reducers/SnackbarReducer";
// Components
import AppLoader from "../components/app-loader/AppLoader.tsx";
import AppSnackbar from "../components/app-snackbar/AppSnackbar.tsx";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header.tsx";
import Home from "../pages/home/Home.tsx";
import AboutMemoria from "../pages/about-memoria/AboutMemoria.tsx";
import AboutMe from "../pages/about-me/AboutMe.tsx";
import Faq from "../pages/faq/Faq.tsx";
import MapAndLocation from "../pages/map/MapAndLocation.tsx";
import CollectionComponent from "../pages/collection/CollectionComponent";
import LocationComponent from "../pages/location/LocationComponent";
import ItemComponent from "../pages/item/ItemComponent";
import ProfileComponent from "../pages/profile/ProfileComponent";
import SessionExpireDialog from "../components/session-expire-dialog/SessionExpireDialog.tsx";
// Models
import {CookieKey} from "../constants/Storage";
import {PathName} from '../constants/Page';
// Services
import {CookieUtil} from "../utils/CookieUtil";
import {appAxios} from "../api";

export default function App() {
    const currentLanguage = useAppSelector(state => state.language.currentLanguage);
    const currentUser = useAppSelector(state => state.user.value);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userQuery = useUserQuery();

    useEffect(() => {
        if (CookieUtil.getCookie(CookieKey.ACCESS_TOKEN)) {
            appAxios.defaults.headers.Authorization = CookieUtil.getCookie(CookieKey.ACCESS_TOKEN);

            if (window.location.pathname === '/') {
                navigate(PathName.MAP);
            }
        }
    }, [navigate]);

    useEffect(() => {
        i18n.changeLanguage(currentLanguage);
    }, [currentLanguage]);

    useEffect(() => {
        if (userQuery.data) {
            dispatch(setUser(userQuery.data));
        }
    }, [dispatch, userQuery.data]);

    return (
        <Fragment>
            <AppSnackbar/>
            <div className="App">
                {!userQuery.isLoading && (
                    currentUser ? <Sidebar/> : <Header/>
                )}

                <div className="main-container">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path={PathName.ABOUT_MEMORIA} element={<AboutMemoria/>}/>
                        <Route path={PathName.ABOUT_ME} element={<AboutMe/>}/>
                        <Route path={PathName.FAQ} element={<Faq/>}/>
                        <Route path={PathName.MAP} element={
                            <Protected>
                                <MapAndLocation/>
                            </Protected>
                        }/>
                        <Route path={PathName.COLLECTION} element={
                            <Protected>
                                <CollectionComponent/>
                            </Protected>
                        }/>
                        <Route path={PathName.LOCATION} element={
                            <Protected>
                                <LocationComponent/>
                            </Protected>
                        }/>
                        <Route path={PathName.ITEM} element={
                            <Protected>
                                <ItemComponent/>
                            </Protected>
                        }/>
                        <Route path={PathName.PROFILE} element={
                            <Protected>
                                <ProfileComponent/>
                            </Protected>
                        }/>
                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
                    </Routes>
                </div>
            </div>
        </Fragment>
    );
}

function Protected({children}: Readonly<{ children: React.JSX.Element }>) {

    return (
        <Fragment>
            {CookieUtil.getCookie(CookieKey.ACCESS_TOKEN) ? children : <SessionExpireDialog/>}
        </Fragment>
    )
}

function OAuth2RedirectHandler() {
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
