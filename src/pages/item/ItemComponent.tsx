import "./ItemComponent.scss";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {AppBar, Grid2 as Grid, IconButton, Toolbar, Typography} from "@mui/material";
import {Link, useSearchParams} from "react-router";
import {KeyboardArrowRight} from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
// Hook
import {useAppDispatch} from "../../app/hook";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {openSidebar} from "../../reducers/SidebarReducer";
import {useItemQuery} from "../../custom-query/ItemQueryHook.ts";
// Component
import AppLoader from "../../components/app-loader/AppLoader.tsx";
import ItemViewDialog from "./item-view-dialog/ItemViewDialog";
// Models / Constants
import {Item} from "../../models/Item";
import {SessionKey} from "../../constants/Storage";
import {PathName} from "../../constants/Page";

export default function ItemComponent() {
    const [locationId, setLocationId] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [locationPlace, setLocationPlace] = useState('');
    const [items, setItems] = useState<Item[]>([])
    const [choseIndex, setChoseIndex] = useState(-1);
    const [viewDialogOpened, setViewDialogOpened] = useState(false);

    const [searchParams] = useSearchParams();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const itemQuery = useItemQuery(locationId, "medium")

    useEffect(() => {
        document.title = `MEMORIA | ${sessionStorage.getItem(SessionKey.LOCATION_PLACE)}`;

        setCollectionName(sessionStorage.getItem(SessionKey.COLLECTION_NAME) ?? '');
        setLocationPlace(sessionStorage.getItem(SessionKey.LOCATION_PLACE) ?? '');
        if (searchParams.has('id')) {
            setLocationId(searchParams.get('id') as string);
        }
    }, [searchParams]);

    useEffect(() => {
        if (itemQuery.isError) {
            dispatch(openSnackbar({type: "error", message: t("item.cannot_load")}));
        }
    }, [dispatch, itemQuery.isError, t]);

    useEffect(() => {
        if (itemQuery.data) {
            setItems([...itemQuery.data].sort((a, b) => new Date(a.takenDateTime).getTime() - new Date(b.takenDateTime).getTime()));
        }
    }, [itemQuery.data]);

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    const handleOpenViewDialog = (itemIndex: number) => {
        setChoseIndex(itemIndex);
        setViewDialogOpened(true);
    }

    const onCloseViewDialog = () => {
        setViewDialogOpened(false);
        setChoseIndex(-1);
    }

    return (
        <section className="item-container">
            {/* App Bar */}
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit"
                                onClick={handleOpenMenu}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography className="page-title" variant="h6" component="div" sx={{flexGrow: 1}}>
                        <Link className="collection-title" to={`/${PathName.COLLECTION}`}>
                            {t("page.collection")}
                        </Link>
                        <KeyboardArrowRight/>
                        <Link className="location-title"
                              to={`/${PathName.LOCATION}?id=${sessionStorage.getItem(SessionKey.COLLECTION_ID)}`}>
                            {collectionName}
                        </Link>
                        <KeyboardArrowRight/>
                        <div className="location-place">
                            {locationPlace}
                        </div>
                    </Typography>
                </Toolbar>
            </AppBar>
            {/* Image/Video List */}
            {itemQuery.isLoading ? <AppLoader/> : (
                <Grid className="item-list" container spacing={1}>
                    {items.map((item, index) =>
                        <Grid key={item.id} size={{xs: 4, sm: 3, md: 3, lg: 2}}
                              // onContextMenu={(event) => handleRightClickImage(event)}
                              onClick={() => handleOpenViewDialog(index)}>
                            <img alt={item.name} src={item.thumbnailUrl}/>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Dialogs */}
            <ItemViewDialog open={viewDialogOpened} onClose={onCloseViewDialog} itemIndex={choseIndex} items={items}/>
        </section>
    )
}
