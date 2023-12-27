import "./ProfileComponent.scss";
import React, {useEffect, useState} from "react";
import {AppBar, Avatar, Button, IconButton, TextField, Toolbar, Typography} from "@mui/material";
import {Edit, Menu} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {openSidebar} from "../../reducers/SidebarReducer";

interface Input {
    name: string;
}

function ProfileComponent() {
    const [inputs, setInputs] = useState({} as Input);

    const currentUser = useAppSelector(state => state.user.value);
    const sidebarOpened = useAppSelector(state => state.sidebar.opened);
    const dispatch = useAppDispatch();

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(state => ({...state, [event.target.name]: event.target.value}))
    }

    useEffect(() => {
        if (currentUser) {
            setInputs({name: currentUser.name})
        }
    }, [currentUser]);

    return (
        <section className="profile-container">
            <AppBar position="static">
                <Toolbar>
                    {!sidebarOpened ? (
                        <IconButton size="large" edge="start" color="inherit"
                                    aria-label="menu" sx={{ mr: 2 }}
                                    onClick={() => {dispatch(openSidebar())}}>
                            <Menu />
                        </IconButton>
                    ) : null }
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Hồ Sơ
                    </Typography>
                    <Button className="add-btn" variant="outlined" startIcon={<Edit />}>
                        Sửa
                    </Button>
                </Toolbar>
            </AppBar>
            {currentUser && (
                <div className="user-profile">
                    <Avatar alt={currentUser.name} src={currentUser.avatarUrl} />
                    <TextField autoComplete="off" required fullWidth
                               name="name" label="Tên"
                               value={inputs.name}
                               onChange={onInputChange}/>
                    <TextField fullWidth disabled={true}
                               label="Email"
                               value={currentUser.email}/>
                </div>
            )}
        </section>
    )
}

export default ProfileComponent;