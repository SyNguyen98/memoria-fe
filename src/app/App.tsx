import './App.scss';
import React, {Fragment, useEffect} from 'react';
import {Navigate, Route, Routes, useNavigate, useSearchParams} from "react-router-dom";
import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import i18n from "../translation/i18n.tsx";
import {useQueryClient} from "@tanstack/react-query";
import {useUserQuery} from "../custom-query/UserQueryHook.ts";
// Redux
import {useAppDispatch, useAppSelector} from "./hook";
import {setUser} from "../reducers/UserReducer";
import {openSnackbar} from "../reducers/SnackbarReducer";
// Components
import AppLoader from "../components/AppLoader";
import AppSnackbar from "../components/AppSnackbar.tsx";
import Sidebar from "../layout/sidebar/Sidebar";
import Header from "../layout/header/Header.tsx";
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
// Services
import {CookieUtil} from "../utils/CookieUtil";
import {AuthApi} from "../api/AuthApi";
import {appAxios} from "../api";

export default function App() {
    const currentLanguage = useAppSelector(state => state.language.currentLanguage);
    const currentUser = useAppSelector(state => state.user.value);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const userQuery = useUserQuery();

    useEffect(() => {
        if (CookieUtil.getCookie(CookieKey.ACCESS_TOKEN)) {
            appAxios.interceptors.request.use((config) => {
                config.headers.Authorization = CookieUtil.getCookie(CookieKey.ACCESS_TOKEN);
                return config;
            }, (error) => {
                return Promise.reject(error);
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

    useEffect(() => {
        if (userQuery.error) {
            dispatch(openSnackbar({type: "error", message: t("user.cannot_load")}));
        }
    }, [dispatch, t, userQuery.error]);

    const isTabletOrPhone = () => {
        return window.innerWidth < 901;
    }

    return (
        <Fragment>
            <AppSnackbar/>
            <div className="App">
                {isTabletOrPhone() ? (
                    <Fragment>
                        <img className="sorry-img" alt="cry-icon"
                             src="https://i.ibb.co/Dtb9SXV/scaracat-sad.webp"/>
                        <Typography className="sorry-text" variant="body1">
                            Sorry we did not support phone screen yet.<br/>
                            Please try again with desktop screen.
                        </Typography>
                    </Fragment>
                ) : (
                    <Fragment>
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
                                <Route path={PathName.COLLECTION}>
                                    <Route index element={
                                        <Protected>
                                            <CollectionComponent/>
                                        </Protected>
                                    }/>
                                    <Route path={PathName.LOCATION}>
                                        <Route index element={
                                            <Protected>
                                                <LocationComponent/>
                                            </Protected>
                                        }/>
                                        <Route path={PathName.ITEM} element={
                                            <Protected>
                                                <ItemComponent/>
                                            </Protected>
                                        }/>
                                    </Route>
                                </Route>
                                <Route path={PathName.PROFILE} element={
                                    <Protected>
                                        <ProfileComponent/>
                                    </Protected>
                                }/>
                                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
                                <Route path="/login/microsoft" element={<OAuth2MicrosoftRedirectHandler/>}/>
                            </Routes>
                        </div>
                    </Fragment>
                )}
            </div>
        </Fragment>
    );
}

function Protected({children}: Readonly<{ children: React.JSX.Element }>) {

    return (
        <Fragment>
            {CookieUtil.getCookie(CookieKey.ACCESS_TOKEN) ? children : <Navigate to="/" replace/>}
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

            appAxios.interceptors.request.use((config) => {
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            }, (error) => {
                return Promise.reject(error);
            });

            queryClient.invalidateQueries({queryKey: ["getCurrentUser"]}).then(() => {
                navigate("/map");
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: t("user.cannot_load")}));
            })
        }
    }, [dispatch, navigate, queryClient, searchParams, t]);

    return <AppLoader/>;
}

function OAuth2MicrosoftRedirectHandler() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(state => state.user.value);

    useEffect(() => {
        const code = searchParams.get('code');
        if (currentUser && code) {
            AuthApi.sendAuthorizeCode(code).then(() => {
                navigate("/map");
            });
        }
    }, [currentUser, dispatch, navigate, searchParams]);

    return <AppLoader />;
}
