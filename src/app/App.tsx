import './App.scss';
import React, {useEffect} from 'react';
import {Route, Routes, useNavigate} from "react-router";
import i18n from "../translation/i18n.tsx";
import {useUserQuery} from "../custom-query/UserQueryHook.ts";
// Redux
import {useAppDispatch, useAppSelector} from "./hook";
import {setUser} from "../reducers/UserReducer";
// Components
import OAuthRedirectHandler from "../components/oauth-redirect-handler/OAuthRedirectHandler";
import AppSnackbar from "../components/app-snackbar/AppSnackbar";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import Home from "../pages/home/Home";
import AboutMemoria from "../pages/about-memoria/AboutMemoria";
import AboutMe from "../pages/about-me/AboutMe";
import Faq from "../pages/faq/Faq";
import PrivacyPolicies from "../pages/privacy/PrivacyPolicies";
import MapAndLocation from "../pages/map/MapAndLocation";
import CollectionList from "../pages/collection/CollectionList.tsx";
import LocationList from "../pages/location/LocationList.tsx";
import ItemList from "../pages/item/ItemList.tsx";
import ProfileComponent from "../pages/profile/ProfileComponent";
import SessionExpireDialog from "../components/session-expire-dialog/SessionExpireDialog";
// Models
import {CookieKey} from "../constants/Storage";
import {PathName} from '../constants/Page';
// Services
import {CookieUtil} from "../utils/CookieUtil";
import {appAxios} from "../api";
import AppToolbar from "../components/app-toolbar/AppToolbar.tsx";

const PATH_NOT_LOGIN = ['/', PathName.ABOUT_MEMORIA, PathName.ABOUT_ME, PathName.FAQ, PathName.PRIVACY];
const PATH_LOGIN = [PathName.MAP, PathName.COLLECTION, PathName.LOCATION, PathName.ITEM, PathName.PROFILE];

export default function App() {
    const currentLanguage = useAppSelector(state => state.language.currentLanguage);
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
        <>
            <AppSnackbar/>
            <div className="App">
                {(window.location.pathname === '/' || PATH_NOT_LOGIN.includes(window.location.pathname.slice(1))) && <Header/>}
                {PATH_LOGIN.includes(window.location.pathname.slice(1)) && (
                    <>
                        <AppToolbar/>
                        <Sidebar/>
                    </>
                )}

                <div className="main-container">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path={PathName.ABOUT_MEMORIA} element={<AboutMemoria/>}/>
                        <Route path={PathName.ABOUT_ME} element={<AboutMe/>}/>
                        <Route path={PathName.FAQ} element={<Faq/>}/>
                        <Route path={PathName.PRIVACY} element={<PrivacyPolicies/>}/>
                        <Route path={PathName.MAP} element={
                            <Protected>
                                <MapAndLocation/>
                            </Protected>
                        }/>
                        <Route path={PathName.COLLECTION} element={
                            <Protected>
                                <CollectionList/>
                            </Protected>
                        }/>
                        <Route path={PathName.LOCATION} element={
                            <Protected>
                                <LocationList/>
                            </Protected>
                        }/>
                        <Route path={PathName.ITEM} element={
                            <Protected>
                                <ItemList/>
                            </Protected>
                        }/>
                        <Route path={PathName.PROFILE} element={
                            <Protected>
                                <ProfileComponent/>
                            </Protected>
                        }/>
                        <Route path="/oauth2/redirect" element={<OAuthRedirectHandler/>}/>
                    </Routes>
                </div>
            </div>
        </>
    );
}

function Protected({children}: Readonly<{ children: React.JSX.Element }>) {

    return (
        CookieUtil.getCookie(CookieKey.ACCESS_TOKEN) ? children : <SessionExpireDialog/>
    )
}
