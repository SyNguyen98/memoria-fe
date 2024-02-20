import './App.scss';
import React, {Fragment, useEffect} from 'react';
import {Navigate, Route, Routes, useNavigate, useSearchParams} from "react-router-dom";
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
import {User} from "../models/User";
import {CookieKey} from "../constants/Storage";
import {PathName} from '../constants/Page';
// Services
import {CookieUtil} from "../utils/CookieUtil";
import {UserApi} from "../api/UserApi";
import {AuthApi} from "../api/AuthApi";
import {appAxios} from "../api";

export default function App() {
    const currentUser = useAppSelector(state => state.user.value);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (CookieUtil.getCookie(CookieKey.ACCESS_TOKEN)) {
            appAxios.interceptors.request.use((config) => {
                config.headers.Authorization = CookieUtil.getCookie(CookieKey.ACCESS_TOKEN);
                return config;
            }, (error) => {
                return Promise.reject(error);
            });

            UserApi.getCurrentUser().then((res: User) => {
                dispatch(setUser(res));
                if (window.location.pathname === '/') {
                    navigate(PathName.MAP);
                }
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải thông tin người dùng"}));
            })
        }
    }, [dispatch, navigate]);

    return (
        <Fragment>
            <AppSnackbar />
            <div className="App">
                {currentUser && <Sidebar/>}
                {!currentUser && <Header/>}

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

            UserApi.getCurrentUser().then((res: User) => {
                dispatch(setUser(res));
                navigate("/map");
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải thông tin người dùng"}));
            })
        }
    }, [dispatch, navigate, searchParams]);

    return <AppLoader />;
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
