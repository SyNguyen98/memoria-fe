import {useEffect, useState} from "react";
import {Link, useLocation, useSearchParams} from "react-router";
import {useTranslation} from "react-i18next";
import {AppBar, IconButton, InputAdornment, MenuItem, Select, Toolbar, Tooltip, Typography} from "@mui/material";
import {KeyboardArrowRight, Language, Menu, MusicNote, MusicOff, Shuffle} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {openSidebar} from "../../reducers/SidebarReducer";
import {useLocationByIdQuery} from "../../custom-query/LocationQueryHook.ts";
import {useCollectionByIdQuery} from "../../custom-query/CollectionQueryHook.ts";
import {PathName} from "../../constants/Page";
import {useAudio} from "../../providers/AudioProvider.tsx";
import {SelectChangeEvent} from "@mui/material/Select";
import {setLanguage} from "../../reducers/LanguageReducer.ts";
import {isTabletOrPhone} from "../../utils/ScreenUtil.ts";

export default function AppToolbar() {
    const [collectionId, setCollectionId] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [locationId, setLocationId] = useState('');
    const [locationPlace, setLocationPlace] = useState('');

    const [searchParams] = useSearchParams();
    const {pathname} = useLocation();
    const {t} = useTranslation();
    const {isPlaying, playPause, nextTrack} = useAudio();

    const currentLanguage = useAppSelector(state => state.language.currentLanguage);
    const dispatch = useAppDispatch();

    const collectionQuery = useCollectionByIdQuery(collectionId);
    const locationQuery = useLocationByIdQuery(locationId);

    useEffect(() => {
        if (searchParams.has('id')) {
            if (pathname === `/${PathName.LOCATION}`) {
                setCollectionId(searchParams.get('id') as string);
            }
            if (pathname === `/${PathName.ITEM}`) {
                setLocationId(searchParams.get('id') as string);
            }
        }
    }, [searchParams, pathname]);

    useEffect(() => {
        if (collectionQuery.data) {
            setCollectionName(collectionQuery.data.name);
        }
    }, [collectionQuery.data]);

    useEffect(() => {
        if (locationQuery.data) {
            setLocationPlace(locationQuery.data.place);
        }
    }, [locationQuery.data]);

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    const handleChangeLanguage = (event: SelectChangeEvent) => {
        dispatch(setLanguage(event.target.value));
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton size="large" edge="start" color="inherit" onClick={handleOpenMenu}>
                    <Menu/>
                </IconButton>
                <Typography className="page-title" variant="h6" component="div"
                            sx={{flexGrow: 1, display: 'flex'}}>
                    {pathname === `/${PathName.MAP}` &&
                        <>
                            {t("page.map")}
                        </>
                    }
                    {pathname !== `/${PathName.MAP}` &&
                        <Link to={`/${PathName.COLLECTION}`}>
                            {t("page.collection")}
                        </Link>
                    }
                    {!isTabletOrPhone() &&
                        <>
                            {(pathname.includes(PathName.LOCATION) || pathname.includes(PathName.ITEM)) &&
                                <>
                                    <KeyboardArrowRight sx={{margin: "auto .5rem"}}/>
                                    <Link to={`/${PathName.LOCATION}?id=${collectionQuery.data?.id}`}>
                                        {collectionName}
                                    </Link>
                                </>
                            }
                            {pathname.includes(PathName.ITEM) &&
                                <>
                                    <KeyboardArrowRight sx={{margin: "auto .5rem"}}/>
                                    <div>
                                        {locationPlace}
                                    </div>
                                </>
                            }
                        </>
                    }
                </Typography>
                <IconButton size="large" edge="start" color="inherit"
                            sx={{marginRight: '.25rem'}}
                            onClick={playPause}>
                    {isPlaying ? (
                        <Tooltip title={"Mute"}>
                            <MusicNote/>
                        </Tooltip>
                    ) : (
                        <Tooltip title={"Unmute"}>
                            <MusicOff/>
                        </Tooltip>
                    )}
                </IconButton>
                <IconButton size="large" edge="start" color="inherit"
                            sx={{marginRight: '.5rem'}}
                            onClick={nextTrack}>
                    <Tooltip title={"Shuffle"}>
                        <Shuffle/>
                    </Tooltip>
                </IconButton>
                <Select autoWidth
                        variant="standard"
                        value={currentLanguage}
                        onChange={handleChangeLanguage}
                        startAdornment={
                            <InputAdornment position="start" sx={{color: 'white'}}>
                                <Language/>
                            </InputAdornment>}
                        sx={{
                            color: 'white',
                            '& .MuiSelect-icon': {
                                color: 'white',
                            },
                            '&::before': {
                                borderBottom: 'none !important',
                            },
                        }}>
                    <MenuItem value="vn">
                        VI
                    </MenuItem>
                    <MenuItem value="en">
                        EN
                    </MenuItem>
                </Select>
            </Toolbar>
        </AppBar>
    )
}
