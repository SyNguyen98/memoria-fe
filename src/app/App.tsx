import './App.scss';
import React, {Fragment, useEffect} from 'react';
import {BrowserRouter, Navigate, Route, Routes, useNavigate, useSearchParams} from "react-router-dom";
import {Alert, Snackbar} from "@mui/material";
// Redux
import {useAppDispatch, useAppSelector} from "./hook";
import {setUser} from "../reducers/UserReducer";
import {closeSnackbar, openSnackbar} from "../reducers/SnackbarReducer";
// Components
import AppLoader from "../components/AppLoader";
import Sidebar from "../layout/sidebar/Sidebar";
import HomeComponent from "../pages/home/HomeComponent";
import MapComponent from "../pages/map/MapComponent";
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
    const snackbar = useAppSelector(state => state.snackbar.value);
    const dispatch = useAppDispatch();

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
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải thông tin người dùng"}));
            })
        }
    }, [dispatch]);

    return (
        <BrowserRouter>
            <div className="App">
                {currentUser && <Sidebar/>}
                <div className="main-container">
                    <Routes>
                        <Route path="/" element={<HomeComponent/>}/>
                        <Route path={PathName.MAP} element={
                            <Protected>
                                <MapComponent/>
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
                        <Route path="oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
                        <Route path="login/microsoft" element={<OAuth2MicrosoftRedirectHandler/>}/>
                    </Routes>
                </div>
            </div>
            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={3000}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                      onClose={() => dispatch(closeSnackbar())}>
                <Alert severity={snackbar.type}>{snackbar.message}</Alert>
            </Snackbar>
        </BrowserRouter>
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
