import "./ItemViewDialog.scss";
import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogTitle, Divider, IconButton} from "@mui/material";
import {Close, SkipNext, SkipPrevious} from '@mui/icons-material';
import {useAppDispatch} from "../../../app/hook";
import {openSnackbar} from "../../../reducers/SnackbarReducer";
import {Item} from "../../../models/Item";
import {ItemApi} from "../../../api/ItemApi";
import {Location} from "../../../models/Location";
import {HashLoader} from "react-spinners";

type Props = {
    open: boolean;
    onClose: () => void;
    location: Location | null;
}

export default function ImageDialog(props: Readonly<Props>) {
    const [items, setItems] = useState<Item[]>([]);
    const [itemChose, setItemChose] = useState<Item | null>(null);
    const [index, setIndex] = useState(0);
    const [itemLoading, setItemLoading] = useState(true);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.location) {
            ItemApi.getAllItemsByDriveItemId(props.location.driveItemId!, "medium").then(res => {
                setItems(res);
                setItemChose(res[0]);
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải hình ảnh"}));
            })
        }
    }, [props.open, props.location, dispatch]);

    const handlePrevious = () => {
        setItemLoading(true);
        if (index === 0) {
            setIndex(items.length - 1);
            setItemChose(items[items.length - 1]);
        } else {
            setIndex(index - 1);
            setItemChose(items[index - 1]);
        }
    }

    const handleNext = () => {
        setItemLoading(true);
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
        setItemLoading(true);
    }

    const onWheel = (event: React.WheelEvent<HTMLDivElement>, elementId: string) => {
        event.preventDefault();
        const container = document.getElementById(elementId)!;
        const containerScrollPosition = document.getElementById(elementId)!.scrollLeft;
        container.scrollTo({
            top: 0,
            left: containerScrollPosition + event.deltaY,
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
            <div className="dialog-body">
                <div className="item-wrapper">
                    {itemLoading && (<HashLoader className="item-loading" color="#2196F3" size={80}/>)}
                    {itemChose && (itemChose.mimeType.includes('image') ? (
                        <img className="item-chose"
                             style={{display: `${itemLoading ? 'none' : 'block'}`}}
                             alt={itemChose.name} src={itemChose.downloadUrl}
                             onLoadCapture={() => {setItemLoading(false)}}/>
                    ) : (
                        <video className="item-chose" controls autoPlay
                               style={{display: `${itemLoading ? 'none' : 'block'}`}}
                               src={itemChose.downloadUrl}
                               onLoadedData={() => {setItemLoading(false)}}/>
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
