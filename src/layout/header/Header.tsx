import "./Header.scss";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {InputAdornment, MenuItem, Select} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {Language} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../../app/hook.ts";
import {setLanguage} from "../../reducers/LanguageReducer.ts";
import {PathName} from "../../constants/Page.ts";

export default function Header() {
    const {t} = useTranslation();

    const currentLanguage = useAppSelector(state => state.language.currentLanguage);
    const dispatch = useAppDispatch();

    const handleChangeLanguage = (event: SelectChangeEvent) => {
        dispatch(setLanguage(event.target.value));
    }

    return (
        <div className="header-container">
            <div className="header-content">
                <div className="logo-app-name">
                    <img alt="App Logo" width={50} height={50}
                         src="https://i.ibb.co/khS54Vr/app-logo.png"/>
                    <div className="app-name">
                        ME<span>MO</span>RIA
                    </div>
                </div>
                <div className="header-menu">
                    <Link to="/">
                        {t('header_menu.homepage')}
                    </Link>
                    <Link to={`/${PathName.ABOUT_MEMORIA}`}>
                        {t('header_menu.about_memoria')}
                    </Link>
                    <Link to={`/${PathName.ABOUT_ME}`}>
                        {t('header_menu.about_me')}
                    </Link>
                    <Link to={`/${PathName.FAQ}`}>
                        FAQ
                    </Link>
                    <Select className="language-select" autoWidth
                            value={currentLanguage}
                            onChange={handleChangeLanguage}
                            startAdornment={<InputAdornment position="start"><Language/></InputAdornment>}>
                        <MenuItem value="vn">
                            Tiếng Việt
                        </MenuItem>
                        <MenuItem value="en">
                            English
                        </MenuItem>
                    </Select>
                </div>
            </div>
        </div>
    );
}