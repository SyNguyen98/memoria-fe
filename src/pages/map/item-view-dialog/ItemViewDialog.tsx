import "./ItemViewDialog.scss";
import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogTitle, Divider, IconButton} from "@mui/material";
import {Close, SkipNext, SkipPrevious} from '@mui/icons-material';
import {useAppDispatch} from "../../../app/hook";
import {openSnackbar} from "../../../reducers/SnackbarReducer";
import {useItemQuery} from "../../../custom-query/ItemQueryHook.ts";
import {Item} from "../../../models/Item";
import {Location} from "../../../models/Location";
import {HashLoader} from "react-spinners";
import {useTranslation} from "react-i18next";
import {useSwipeable} from "react-swipeable";
import HeicImg from "../../../components/heic-img/HeicImg.tsx";

type Props = {
    open: boolean;
    onClose: () => void;
    location: Location;
}

export default function ImageDialog(props: Readonly<Props>) {
    const [items, setItems] = useState<Item[]>([]);
    const [itemChose, setItemChose] = useState<Item | null>(null);
    const [index, setIndex] = useState(0);

    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const itemQuery = useItemQuery(props.location.id!, "medium")

    const handlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handlePrevious()
    });

    useEffect(() => {
        if (itemQuery.isError) {
            dispatch(openSnackbar({type: "error", message: t("item.cannot_load")}));
        }
    }, [dispatch, itemQuery.isError, t]);

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
        setItemChose(item);
        setIndex(index);
    }

    /**
     * Handles the wheel event to scroll the specified element horizontally.
     */
    const onWheel = (event: React.WheelEvent<HTMLDivElement>, elementId: string) => {
        const scrollSpeedMultiplier = 3; // Increase this value to make scrolling faster
        const container = document.getElementById(elementId)!;
        const containerScrollPosition = document.getElementById(elementId)!.scrollLeft;
        container.scrollTo({
            top: 0,
            left: containerScrollPosition + event.deltaY * scrollSpeedMultiplier,
            behavior: 'smooth'
        });
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
                        <Divider orientation="vertical"/>
                        <IconButton onClick={onClose}>
                            <Close/>
                        </IconButton>
                    </div>
                </DialogTitle>
            )}
            <div className="dialog-body" {...handlers}>
                <div className="item-wrapper">
                    <HashLoader className="item-loading" color="#2196F3" size={80}/>
                    {itemChose && (itemChose.mimeType.includes('image') ? (
                        itemChose.mimeType.includes('heic') ? (
                            <HeicImg alt={itemChose.name} url={itemChose.downloadUrl}/>
                        ) : (
                            <img className="item-chose"
                                 alt={itemChose.name} src={itemChose.downloadUrl}/>
                        )

                    ) : (
                        <video className="item-chose" controls autoPlay
                               src={itemChose.downloadUrl}>
                            <track kind="captions" src={itemChose.downloadUrl} srcLang="en" label="English"/>
                        </video>
                    ))}
                </div>
            </div>
            <div className="dialog-footer">
                <div id="item-list" className="item-list" onWheel={event => onWheel(event, 'item-list')}>
                    {items.map((item, index) =>
                        <Button key={item.id} onClick={() => handleChangeItem(item, index)}>
                            <img alt={item.name} src={item.thumbnailUrl}/>
                        </Button>
                    )}
                </div>
            </div>
        </Dialog>
    )
}
