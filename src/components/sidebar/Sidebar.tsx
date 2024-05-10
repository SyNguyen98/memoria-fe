import "./Sidebar.scss";
import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../app/hook.ts";
import {closeSidebar} from "../../reducers/SidebarReducer.ts";
import {
    Avatar,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip
} from "@mui/material";
import {Collections, FeedbackOutlined, KeyboardDoubleArrowLeft, Language, Logout, Map} from "@mui/icons-material";
import {CookieUtil} from "../../utils/CookieUtil.ts";
import {CookieKey} from "../../constants/Storage.ts";
import {PathName} from "../../constants/Page.ts";
import {VERSION} from "../../constants";
import {clearUser} from "../../reducers/UserReducer.ts";
import {setLanguage} from "../../reducers/LanguageReducer.ts";

export default function Sidebar() {
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(menuAnchorEl);

    const currentUser = useAppSelector(state => state.user.value);
    const sidebarOpened = useAppSelector(state => state.sidebar.opened);
    const currentLanguage = useAppSelector(state => state.language.currentLanguage);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {t} = useTranslation();

    const handleClose = () => {
        dispatch(closeSidebar())
    }

    const handleListItemClick = (url: string) => {
        navigate(url);
    };

    const handleOpenLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleCloseLanguageMenu = () => {
        setMenuAnchorEl(null);
    };

    const handleChangeLanguage = (value: 'vn' | 'en') => {
        dispatch(setLanguage(value));
        setMenuAnchorEl(null);
    }

    const handleOpenFeedback = () => {
        window.open("https://forms.gle/K9b1Rr3TXEYYfx8p6", "_blank");
    }

    const handleLogout = () => {
        CookieUtil.deleteCookie(CookieKey.ACCESS_TOKEN);
        dispatch(clearUser());
        window.location.reload();
    }

    return (
        <Drawer open={sidebarOpened} onClose={handleClose}>
            <div id="navigation-menu">
                <div className="menu-header">
                    <span className="app-name">
                        ME<span className="green">MO</span>RIA
                    </span>
                    <IconButton aria-label="close" onClick={handleClose}>
                        <KeyboardDoubleArrowLeft/>
                    </IconButton>
                </div>
                <Divider/>
                <div className="menu-body">
                    <List>
                        <ListItemButton selected={pathname === `/${PathName.MAP}`}
                                        onClick={() => handleListItemClick(PathName.MAP)}>
                            <ListItemIcon>
                                <Map/>
                            </ListItemIcon>
                            <ListItemText primary={t("page.map")}/>
                        </ListItemButton>
                        <ListItemButton selected={pathname === `/${PathName.COLLECTION}`}
                                        onClick={() => handleListItemClick(PathName.COLLECTION)}>
                            <ListItemIcon>
                                <Collections/>
                            </ListItemIcon>
                            <ListItemText primary={t("page.collection")}/>
                        </ListItemButton>
                    </List>
                </div>
                <div className="menu-footer">
                    <Divider/>
                    <List>
                        {currentUser && (
                            <ListItemButton onClick={() => handleListItemClick(PathName.PROFILE)}>
                                <ListItemAvatar>
                                    <Avatar alt={currentUser.name} src={currentUser.avatarUrl}/>
                                </ListItemAvatar>
                                <ListItemText primary={currentUser.name}/>
                            </ListItemButton>
                        )}
                        <ListItemButton onClick={handleOpenLanguageMenu}>
                            <ListItemIcon>
                                <Language/>
                            </ListItemIcon>
                            <Tooltip title={t("language")}>
                                <ListItemText primary={currentLanguage === 'vn' ? "Tiếng Việt" : "English"}/>
                            </Tooltip>
                        </ListItemButton>
                        <ListItemButton onClick={handleOpenFeedback}>
                            <ListItemIcon>
                                <FeedbackOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={t("feedback")}/>
                        </ListItemButton>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout/>
                            </ListItemIcon>
                            <ListItemText primary={t("logout")}/>
                        </ListItemButton>
                    </List>
                    <div className="version">
                        {VERSION}
                    </div>
                </div>
            </div>
            <Menu id="language-menu"
                  anchorEl={menuAnchorEl}
                  open={openMenu}
                  onClose={handleCloseLanguageMenu}
                  anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                  }}>
                <MenuItem onClick={() => handleChangeLanguage('vn')}>
                    Tiếng Việt
                </MenuItem>
                <MenuItem onClick={() => handleChangeLanguage('en')}>
                    English
                </MenuItem>
            </Menu>
        </Drawer>
    )
}
