import "./ItemComponent.scss";
import React, {useEffect, useState} from "react";
import {AppBar, Grid, IconButton, Toolbar, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {KeyboardArrowRight} from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
// Hook
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {openSidebar} from "../../reducers/SidebarReducer";
// Component
import AppLoader from "../../components/AppLoader";
// Models / Constants
import {Item} from "../../models/Item";
import {SessionKey} from "../../constants/Storage";
import {PathName} from "../../constants/Page";
// Services / Utils
import {ItemApi} from "../../api/ItemApi";
import ItemViewDialog from "./item-view-dialog/ItemViewDialog";

export default function ItemComponent() {
    const [isLoading, setLoading] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [locationPlace, setLocationPlace] = useState('');
    const [items, setItems] = useState<Item[]>([])
    const [choseIndex, setChoseIndex] = useState(-1);
    const [viewDialogOpened, setViewDialogOpened] = useState(false);

    const currentUser = useAppSelector(state => state.user.value);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setCollectionName(sessionStorage.getItem(SessionKey.COLLECTION_NAME) || '');
        setLocationPlace(sessionStorage.getItem(SessionKey.LOCATION_PLACE) || '');
        const driveItemId = sessionStorage.getItem(SessionKey.DRIVE_ITEM_ID);
        if (currentUser && driveItemId) {
            setLoading(true);
            ItemApi.getAllItemsByDriveItemId(driveItemId).then(res => {
                setItems(res);
                setLoading(false);
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải các hình ảnh"}));
                setLoading(false);
            });
        }
    }, [currentUser, dispatch]);

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

    const handleRightClickImage = (event: React.MouseEvent<HTMLImageElement>) => {
        event.preventDefault();
    }

    const handleCloseContextMenu = () => {

    }

    return (
        <section className="item-container">
            {/* App Bar */}
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit"
                                onClick={handleOpenMenu}>
                        <MenuIcon />
                    </IconButton>
                    <Typography className="page-title" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link className="location-title" to={`/${PathName.COLLECTION}`}>
                            Bộ Sưu Tập
                        </Link>
                        <KeyboardArrowRight />
                        <Link className="location-title" to={`/${PathName.COLLECTION}/${PathName.LOCATION}`}>
                            {collectionName}
                        </Link>
                        <KeyboardArrowRight />
                        {locationPlace}
                    </Typography>
                </Toolbar>
            </AppBar>
             {/*Image/Video List */}
            {isLoading ? <AppLoader /> : (
                <Grid className="item-list" container spacing={2}>
                    {items.map((item, index) =>
                        <Grid key={item.id} item lg={2} md={2.4} xs={3}>
                            {item.mimeType.includes('image') ? (
                                <img key={index} alt={item.name} src={item.downloadUrl}
                                    // onContextMenu={(event) => handleRightClickImage(event)}
                                     onClick={() => handleOpenViewDialog(index)} />
                            ) : (
                                <video key={index} src={item.downloadUrl}
                                       onClick={() => handleOpenViewDialog(index)} />
                            )}
                            <p className="item-name">
                                {item.name}
                            </p>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Dialogs */}
            <ItemViewDialog open={viewDialogOpened} onClose={onCloseViewDialog} itemIndex={choseIndex} items={items} />
        </section>
    )
}
