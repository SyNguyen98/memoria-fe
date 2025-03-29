import "./Header.scss";
import {Fragment, MouseEvent, useState} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import {IconButton, InputAdornment, Menu, MenuItem, Select} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {Language} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {useAppDispatch, useAppSelector} from "../../app/hook.ts";
import {setLanguage} from "../../reducers/LanguageReducer.ts";
import {PathName} from "../../constants/Page.ts";
import {isTabletOrPhone} from "../../utils/ScreenUtil.ts";

export default function Header() {
    const {t} = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const currentLanguage = useAppSelector(state => state.language.currentLanguage);
    const dispatch = useAppDispatch();

    const MENU_ITEM = [
        { name: t('header_menu.homepage'), link: '/' },
        // { name: t('header_menu.about_memoria'), link: `/${PathName.ABOUT_MEMORIA}` },
        // { name: t('header_menu.about_me'), link: `/${PathName.ABOUT_ME}` },
        // { name: 'FAQ', link: `/${PathName.FAQ}` },
    ]

    const handleChangeLanguage = (event: SelectChangeEvent) => {
        dispatch(setLanguage(event.target.value));
    }

    const handleOpenNavManu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="header-container">
            <div className="header-content">
                <Link to="/" className="logo-app-name">
                    <img className="app-logo" alt="App Logo"
                         src="https://github.com/SyNguyen98/image-storage/blob/main/app-logo.webp?raw=true"/>
                    <div className="app-name">
                        ME<span>MO</span>RIA
                    </div>
                </Link>
                {isTabletOrPhone() ? (
                    <Fragment>
                        <IconButton size="large" onClick={handleOpenNavManu}>
                            <MenuIcon/>
                        </IconButton>
                        <Menu id="header-nav-menu"
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                              anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'right',
                              }}
                              transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                              }}>
                            {MENU_ITEM.map((item, index) => (
                                <MenuItem key={index} onClick={handleClose}>
                                    <Link to={item.link}>
                                        {item.name}
                                    </Link>
                                </MenuItem>
                            ))}
                            <Select className="language-select" autoWidth
                                    value={currentLanguage}
                                    onChange={handleChangeLanguage}
                                    startAdornment={<InputAdornment position="start"><Language/></InputAdornment>}>
                                <MenuItem value="vn" onClick={handleClose}>
                                    Tiếng Việt
                                </MenuItem>
                                <MenuItem value="en" onClick={handleClose}>
                                    English
                                </MenuItem>
                            </Select>
                        </Menu>
                    </Fragment>
                ) : (
                    <div className="header-menu">
                        {MENU_ITEM.map((item, index) => (
                            <Link to={item.link} key={index}>
                                {item.name}
                            </Link>
                        ))}
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
                )}
            </div>
        </div>
    );
}