import "./Sidebar.scss";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {closeSidebar} from "../../reducers/SidebarReducer";
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
import {CookieUtil} from "../../utils/CookieUtil";
import {CookieKey} from "../../constants/Storage";
import {PathName} from "../../constants/Page";
import {VERSION} from "../../constants";

export default function Sidebar() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const currentUser = useAppSelector(state => state.user.value);
    const sidebarOpened = useAppSelector(state => state.sidebar.opened);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleClose = () => {
        dispatch(closeSidebar())
    }

    const handleListItemClick = (index: number, url: string) => {
        setSelectedIndex(index);
        navigate(url);
    };

    const handleOpenFeedback = () => {
        window.open("https://forms.gle/K9b1Rr3TXEYYfx8p6", "_blank");
    }

    const handleLogout = () => {
        CookieUtil.deleteCookie(CookieKey.ACCESS_TOKEN);
        navigate('/');
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
                    <List component="nav" aria-label="menu map collections">
                        <ListItemButton selected={selectedIndex === 0}
                                        onClick={() => handleListItemClick(0, PathName.MAP)}>
                            <ListItemIcon>
                                <Map/>
                            </ListItemIcon>
                            <ListItemText primary="Bản Đồ"/>
                        </ListItemButton>
                        <ListItemButton selected={selectedIndex === 1}
                                        onClick={() => handleListItemClick(1, PathName.COLLECTION)}>
                            <ListItemIcon>
                                <Collections/>
                            </ListItemIcon>
                            <ListItemText primary="Bộ Sưu Tập"/>
                        </ListItemButton>
                    </List>
                </div>
                <div className="menu-footer">
                    <Divider/>
                    <List component="nav" aria-label="menu map collections">
                        {currentUser && (
                            <ListItemButton onClick={() => handleListItemClick(2, PathName.PROFILE)}>
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
                            <ListItemText primary="Phản hồi lỗi ↗"/>
                        </ListItemButton>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout/>
                            </ListItemIcon>
                            <ListItemText primary="Đăng xuất"/>
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
