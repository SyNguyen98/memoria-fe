import "./ItemList.scss";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Grid, Typography} from "@mui/material";
import {useNavigate, useSearchParams} from "react-router";
import {useAppDispatch} from "../../app/hook";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {useItemQuery} from "../../custom-query/ItemQueryHook.ts";
import {useLocationByIdQuery} from "../../custom-query/LocationQueryHook.ts";
import {useCollectionByLocationIdQuery} from "../../custom-query/CollectionQueryHook.ts";
import AppLoader from "../../components/app-loader/AppLoader.tsx";
import ItemViewDialog from "./item-view-dialog/ItemViewDialog";
import {Item} from "../../models/Item";
import {isTabletOrPhone} from "../../utils/ScreenUtil.ts";
import {KeyboardArrowLeft} from "@mui/icons-material";
import {PathName} from "../../constants/Page.ts";

export default function ItemList() {
    const [locationId, setLocationId] = useState('');
    const [items, setItems] = useState<Item[]>([])
    const [choseIndex, setChoseIndex] = useState(-1);
    const [viewDialogOpened, setViewDialogOpened] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const itemQuery = useItemQuery(locationId, "medium");
    const locationQuery = useLocationByIdQuery(locationId);
    const collectionQuery = useCollectionByLocationIdQuery(locationId);

    useEffect(() => {
        if (locationQuery.data) {
            document.title = `MEMORIA | ${locationQuery.data.place}`;
        }
    }, [locationQuery.data]);

    useEffect(() => {
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
            <Button className="back-btn" variant="text" startIcon={<KeyboardArrowLeft/>}
                    onClick={() => navigate(`/${PathName.LOCATION}?id=${collectionQuery.data?.id}`)}>
                {t("button.back")}
            </Button>
            {isTabletOrPhone() &&
                <Typography variant="h6">
                    {locationQuery.data?.place}
                </Typography>
            }
            {/* Image/Video List */}
            {items.length > 0 ? (
                <Grid className="item-list" container spacing={1}>
                    {items.map((item, index) =>
                        <Grid key={item.id} size={{xs: 4, sm: 3, md: 3, lg: 2}}
                            // onContextMenu={(event) => handleRightClickImage(event)}
                              onClick={() => handleOpenViewDialog(index)}>
                            <img alt={item.name} src={item.thumbnailUrl}/>
                        </Grid>
                    )}
                </Grid>
            ) : (
                itemQuery.isLoading ? <AppLoader/> : (
                    <Typography variant="body1" className="no-item-text">
                        {t("item.no_item")}
                    </Typography>
                )
            )}

            {/* Dialogs */}
            <ItemViewDialog open={viewDialogOpened} onClose={onCloseViewDialog} itemIndex={choseIndex} items={items}/>
        </section>
    )
}
