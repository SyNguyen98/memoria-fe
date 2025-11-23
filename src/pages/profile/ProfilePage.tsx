import "./ProfilePage.scss";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Avatar, TextField} from "@mui/material";
import {useAppContext} from "@providers/AppProvider.tsx";

interface Input {
    name: string;
}

function ProfilePage() {
    const [inputs, setInputs] = useState({} as Input);

    const {currentUser} = useAppContext();
    const {t} = useTranslation();

    useEffect(() => {
        document.title = `MEMORIA | ${t("page.profile")}`;

        if (currentUser) {
            setInputs({name: currentUser.name})
        }
    }, [currentUser, t]);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(state => ({...state, [event.target.name]: event.target.value}))
    }

    return (
        <section className="profile-container">
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

export default ProfilePage;