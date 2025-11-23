import "./Sidebar.scss";
import {useLocation, useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
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
import {CookieUtil} from "@utils/CookieUtil.ts";
import {CookieKey} from "@constants/Storage.ts";
import {PathName} from "@constants/Page.ts";
import {VERSION} from "../../constants";
import {useAppContext} from "@providers/AppProvider.tsx";
import {useSidebarContext} from "@providers/SidebarProvider.tsx";

export default function Sidebar() {
    const {sidebarOpened, setSidebarOpened} = useSidebarContext();
    const {currentUser, setCurrentUser} = useAppContext();

    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {t} = useTranslation();

    const handleClose = () => {
        setSidebarOpened(false);
    }

    const handleListItemClick = (url: string) => {
        navigate(url);
    };

    const handleOpenFeedback = () => {
        window.open("https://forms.gle/K9b1Rr3TXEYYfx8p6", "_blank");
    }

    const handleLogout = () => {
        CookieUtil.deleteCookie(CookieKey.ACCESS_TOKEN);
        setCurrentUser(null);
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
