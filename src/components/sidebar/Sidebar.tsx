import "./Sidebar.scss";
import {useLocation, useNavigate} from "react-router";
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
    ListItemText
} from "@mui/material";
import {Collections, FeedbackOutlined, KeyboardDoubleArrowLeft, Logout, Map} from "@mui/icons-material";
import {CookieUtil} from "../../utils/CookieUtil.ts";
import {CookieKey} from "../../constants/Storage.ts";
import {PathName} from "../../constants/Page.ts";
import {VERSION} from "../../constants";
import {clearUser} from "../../reducers/UserReducer.ts";

export default function Sidebar() {
    const currentUser = useAppSelector(state => state.user.value);
    const sidebarOpened = useAppSelector(state => state.sidebar.opened);
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

    const handleOpenFeedback = () => {
        window.open("https://forms.gle/K9b1Rr3TXEYYfx8p6", "_blank");
    }

    const handleLogout = () => {
        CookieUtil.deleteCookie(CookieKey.ACCESS_TOKEN);
        dispatch(clearUser());
        navigate("/");
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
        </Drawer>
    )
}
