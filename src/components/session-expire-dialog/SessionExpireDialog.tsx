import "./SessionExpireDialog.scss";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import {GOOGLE_AUTH_URL} from "../../constants/Url.ts";

function SessionExpireDialog() {
    const location = useLocation();
    const navigate = useNavigate();
    const {t} = useTranslation();

    useEffect(() => {
        const fullPath = `${location.pathname}${location.search}`;
        localStorage.setItem("lastPath", fullPath);
    }, [location])

    const handleReLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    }

    const handleBack = () => {
        navigate("/");
    }

    return (
        <Dialog className="session-expired-dialog" open={true}>
            <DialogTitle>
                {t("session_expired")}
            </DialogTitle>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleReLogin}>
                    {t("button.login_again")}
                </Button>
                <Button variant="contained" color="inherit" onClick={handleBack}>
                    {t("button.back_homepage")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SessionExpireDialog;