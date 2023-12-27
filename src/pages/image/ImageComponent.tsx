import "./ImageComponent.scss";
import React, {useEffect, useState} from "react";
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {KeyboardArrowRight} from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
// Hook
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {openSidebar} from "../../reducers/SidebarReducer";
// Component
import AppLoader from "../../components/AppLoader";
import ImageViewDialog from "./image-view-dialog/ImageViewDialog";
// Models / Constants
import {Collection} from "../../models/Collection";
import {Item} from "../../models/Item";
import {CollectionApi} from "../../api/CollectionApi";
import {ItemApi} from "../../api/ItemApi";
// Services / Utils

function ImageComponent() {
    const {collectionId} = useParams();
    const [isLoading, setLoading] = useState(false);
    const [collection, setCollection] = useState({} as Collection);
    const [items, setItems] = useState([] as Item[])
    const [choseItemIndex, setChoseItemIndex] = useState(-1);
    const [viewDialogOpened, setViewDialogOpened] = useState(false);

    const sidebarOpened = useAppSelector(state => state.sidebar.opened);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        // Set collection
        // if (sessionStorage.getItem(SessionKey.ALL_COLLECTIONS)) {
        //     const collections: Collection[] = JSON.parse(sessionStorage.getItem(SessionKey.ALL_COLLECTIONS)!);
        //     const collection = collections.find(col => col.id === collectionId!)!
        //     ItemAPI.getAllItemsByDriveItemId(collection.driveItemId!).then(res => {
        //         if (res) {
        //             setItems(res);
        //             setLoading(false);
        //         }
        //     })
        //     setCollection(collection);
        // } else {
            CollectionApi.getCollectionById(collectionId!).then(res => {
                if (res) {
                    setCollection(res);
                    // ItemApi.getAllItemsByDriveItemId(res.driveItemId!).then(res1 => {
                    //     if (res1) {
                    //         setItems(res1);
                    //         setLoading(false);
                    //     }
                    // })
                }
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải bộ sưu tập"}));
            })
        // }
    }, []);

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    const handleBackPage = () => {
        navigate("/collection");
    }

    const handleOpenImageViewDialog = (itemIndex: number) => {
        setChoseItemIndex(itemIndex);
        setViewDialogOpened(true);
    }

    const onCloseImageViewDialog = () => {
        setViewDialogOpened(false);
        setChoseItemIndex(-1);
    }

    const handleRightClickImage = (event: React.MouseEvent<HTMLImageElement>) => {
        event.preventDefault();
    }

    const handleCloseContextMenu = () => {

    }

    return (
        <section className="image-container">
            {/* App Bar */}
            <AppBar position="static">
                <Toolbar>
                    {!sidebarOpened ? (
                        <IconButton size="large" edge="start" color="inherit"
                                    aria-label="menu" sx={{ mr: 2 }}
                                    onClick={handleOpenMenu}>
                            <MenuIcon />
                        </IconButton>
                    ) : null }
                    <Typography className="page-title" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <span className="collection" onClick={() => handleBackPage()}>
                            Bộ Sưu Tập
                        </span>
                        <KeyboardArrowRight />
                        {collection.name}
                    </Typography>
                </Toolbar>
            </AppBar>
            {/* Image/Video List */}
            {/*{isLoading ? <AppLoader /> : (*/}
            {/*    <div className="list-wrapper">*/}
            {/*        <div className="image-list">*/}
            {/*            {items.map((item, index) =>*/}
            {/*                <div key={index} className="image-card">*/}
            {/*                    {item.mimeType.includes('image') ? (*/}
            {/*                        <img key={index} alt={item.name} src={item.downloadUrl}*/}
            {/*                            // onContextMenu={(event) => handleRightClickImage(event)}*/}
            {/*                             onClick={() => handleOpenImageViewDialog(index)} />*/}
            {/*                    ) : (*/}
            {/*                        <video key={index} src={item.downloadUrl}*/}
            {/*                               onClick={() => handleOpenImageViewDialog(index)} />*/}
            {/*                    )}*/}
            {/*                    <p className="image-name">*/}
            {/*                        {item.name}*/}
            {/*                    </p>*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </section>
    )
}

export default ImageComponent;
