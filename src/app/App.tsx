import './App.scss';
import React, {Fragment, useEffect} from 'react';
import {Route, Routes, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
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
// Models
import {CookieKey} from "../constants/Storage";
import {PathName} from '../constants/Page';
import {GOOGLE_AUTH_URL} from "../constants/Url.ts";
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
            appAxios.interceptors.request.use((config) => {
                config.headers.Authorization = CookieUtil.getCookie(CookieKey.ACCESS_TOKEN);
                return config;
            }, (error) => {
                throw new Error(error);
            });
        }
    }, []);

    useEffect(() => {
        i18n.changeLanguage(currentLanguage);
    }, [currentLanguage]);

    useEffect(() => {
        if (userQuery.data) {
            dispatch(setUser(userQuery.data));
            if (window.location.pathname === '/') {
                navigate(PathName.MAP);
            }
        }
    }, [dispatch, navigate, userQuery.data]);

    return (
        <Fragment>
            <AppSnackbar/>
            <div className="App">
                {currentUser ? <Sidebar/> : <Header/>}

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

function SessionExpireDialog() {
    const location = useLocation();
    const {t} = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const fullPath = `${location.pathname}${location.search}`;
        localStorage.setItem("lastPath", fullPath);
    }, [location])

    const handleReLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    }

    const handleBack = () => {
        navigate("/");
    }

    return (
        <Dialog className="session-expired-dialog" open={true}>
            <DialogTitle>
                {t("session_expired")}
            </DialogTitle>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleReLogin}>
                    {t("button.login_again")}
                </Button>
                <Button variant="contained" color="inherit" onClick={handleBack}>
                    {t("button.back_homepage")}
                </Button>
            </DialogActions>
        </Dialog>
    );
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

            appAxios.interceptors.request.use((config) => {
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            }, (error) => {
                throw new Error(error);
            });

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
