import "./Sidebar.scss";
import React, {useState} from "react";
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
import {Collections, KeyboardDoubleArrowLeft, Logout, Map} from "@mui/icons-material";
import {CookieUtil} from "../../utils/CookieUtil";
import {CookieKey} from "../../constants/Storage";
import {Url} from "../../constants/Url";
import {PagePath} from "../../constants/Page";

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
                                        onClick={() => handleListItemClick(0, PagePath.MAP)}>
                            <ListItemIcon>
                                <Map/>
                            </ListItemIcon>
                            <ListItemText primary="Bản Đồ"/>
                        </ListItemButton>
                        <ListItemButton selected={selectedIndex === 1}
                                        onClick={() => handleListItemClick(1, PagePath.COLLECTION)}>
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
                            <ListItemButton onClick={() => handleListItemClick(2, PagePath.PROFILE)}>
                                <ListItemAvatar>
                                    <Avatar alt={currentUser.name} src={currentUser.avatarUrl}/>
                                </ListItemAvatar>
                                <ListItemText primary={currentUser.name}/>
                            </ListItemButton>
                        )}
                        <ListItemButton onClick={() => handleLogout()}>
                            <ListItemIcon>
                                <Logout/>
                            </ListItemIcon>
                            <ListItemText primary="Đăng xuất"/>
                        </ListItemButton>
                    </List>
                    <div className="owner">
                        Owned by <img className="logo" alt="chika" src={`${Url.IMAGE}/chika-logo.png`}/>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}
