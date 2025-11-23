import "./ItemViewDialog.scss";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Dialog, DialogTitle, Divider, Drawer, IconButton} from "@mui/material";
import {Close, KeyboardArrowLeft, KeyboardArrowRight, SkipNext, SkipPrevious} from '@mui/icons-material';
import {useItemQuery} from "@queries/ItemQueryHook.ts";
import {Item} from "@models/Item.ts";
import {Location} from "@models/Location.ts";
import AppLoader from "../../../components/app-loader/AppLoader.tsx";
import {useAppSnackbarContext} from "@providers/AppSnackbar.tsx";

type Props = {
    open: boolean;
    onClose: () => void;
    location: Location;
}

export default function ImageDialog(props: Readonly<Props>) {
    const [items, setItems] = useState<Item[]>([]);
    const [itemChose, setItemChose] = useState<Item | null>(null);
    const [index, setIndex] = useState(0);
    const [itemLoading, setItemLoading] = useState(true);
    const [listOpen, setListOpen] = useState(true);

    const {t} = useTranslation();
    const {openSnackbar} = useAppSnackbarContext();

    const itemQuery = useItemQuery(props.location.id!, "medium")

    useEffect(() => {
        if (itemQuery.isError) {
            openSnackbar("error", t("item.cannot_load"));
        }
    }, [itemQuery.isError, openSnackbar, t]);

    useEffect(() => {
        if (itemQuery.data) {
            setItems(itemQuery.data);
            setItemChose(itemQuery.data[0]);
        }
    }, [itemQuery.data]);

    const handlePrevious = () => {
        if (index === 0) {
            setIndex(items.length - 1);
            setItemChose(items[items.length - 1]);
        } else {
            setIndex(index - 1);
            setItemChose(items[index - 1]);
        }
    }

    const handleNext = () => {
        if (index === items.length - 1) {
            setIndex(0);
            setItemChose(items[0]);
        } else {
            setIndex(index + 1);
            setItemChose(items[index + 1]);
        }
    }

    const handleChangeItem = (item: Item, index: number) => {
        setItemLoading(true);
        setItemChose(item);
        setIndex(index);
    }

    const onClose = () => {
        setItems([]);
        setItemChose(null);
        setIndex(0);
        props.onClose();
    }

    return (
        <Dialog className="map-item-view-dialog" fullScreen open={props.open} onClose={onClose}>
            {props.location && (
                <DialogTitle>
                    <p className="location-place">
                        {props.location.place}
                    </p>
                    <p className="item-name">
                        {itemChose ? itemChose.name : ''}
                    </p>

                    <div className="btn-wrapper">
                        {items.length > 0 && (
                            <div className="item-index">
                                <IconButton aria-label="previous" onClick={() => handlePrevious()}>
                                    <SkipPrevious/>
                                </IconButton>
                                <span className="index">
                                    {index + 1} / {items.length}
                                </span>
                                <IconButton aria-label="next" onClick={() => handleNext()}>
                                    <SkipNext/>
                                </IconButton>
                            </div>
                        )}
                        <Divider orientation="vertical"/>
                        <IconButton onClick={onClose}>
                            <Close/>
                        </IconButton>
                    </div>
                </DialogTitle>
            )}
            {!listOpen && (
                <Button className="open-list-btn"
                        onClick={() => setListOpen(true)}
                        startIcon={<KeyboardArrowLeft/>}>
                    {t("map.view_list")}
                </Button>
            )}
            <div className={`dialog-body ${listOpen ? 'drawer-open' : 'drawer-closed'}`}>
                <AppLoader/>
                {itemChose && (itemChose.mimeType.includes('image') ? (
                    <img className="item-chose"
                         style={{display: `${itemLoading ? 'none' : 'block'}`}}
                         alt={itemChose.name}
                         src={itemChose.downloadUrl}
                         onLoadCapture={() => {
                             setItemLoading(false)
                         }}/>
                ) : (
                    <video className="item-chose" controls autoPlay
                           style={{display: `${itemLoading ? 'none' : 'block'}`}}
                           src={itemChose.downloadUrl}
                           onLoadedData={() => {
                               setItemLoading(false)
                           }}>
                        <track kind="captions" src={itemChose.downloadUrl} srcLang="en" label="English"/>
                    </video>
                ))}
            </div>
            <Drawer className='item-list-drawer'
                    variant="persistent"
                    anchor="right"
                    open={listOpen}>
                <Button className="close-list-btn" onClick={() => {
                    setListOpen(false)
                }}
                        endIcon={<KeyboardArrowRight/>}>
                    {t("map.close_list")}
                </Button>
                <div style={{overflowY: 'auto'}}>
                    {items.map((item, index) =>
                        <Button key={item.id} className="item"
                                onClick={() => handleChangeItem(item, index)}>
                            <img alt={item.name} src={item.thumbnailUrl}/>
                        </Button>
                    )}
                </div>
            </Drawer>
        </Dialog>
    )
}
