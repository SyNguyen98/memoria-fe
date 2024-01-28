import "./ItemViewDialog.scss";
import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, Divider, IconButton, Toolbar, Typography} from "@mui/material";
import {Close, SkipNext, SkipPrevious} from "@mui/icons-material";
import {Item} from "../../../models/Item";
import {HashLoader} from "react-spinners";

type Props = {
    open: boolean;
    onClose: () => void;
    items: Item[];
    itemIndex: number;
}

export default function ItemViewDialog(props: Readonly<Props>) {
    const [item, setItem] = useState<Item | null>(null);
    const [index, setIndex] = useState(-1);
    const [itemLoading, setItemLoading] = useState(true);

    useEffect(() => {
        setItemLoading(true)
        setIndex(props.itemIndex);
        setItem(props.items[props.itemIndex]);
    }, [props]);

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        switch (event.key) {
            case "Escape":
                onClose();
                break;
            case "ArrowRight":
                handleNext();
                break;
            case "ArrowLeft":
                handlePrevious();
                break;
        }
    }

    const handlePrevious = () => {
        setItemLoading(true);
        if (index === 0) {
            setIndex(props.items.length - 1);
            setItem(props.items[props.items.length - 1]);
        } else {
            setIndex(index - 1);
            setItem(props.items[index - 1]);
        }
    }

    const handleNext = () => {
        setItemLoading(true);
        if (index === props.items.length - 1) {
            setIndex(0);
            setItem(props.items[0]);
        } else {
            setIndex(index + 1);
            setItem(props.items[index + 1]);
        }
    }

    const onClose = () => {
        setItem(null);
        setIndex(-1);
        props.onClose();
    }

    return (
        <Dialog className="item-view-dialog" fullScreen
                open={props.open} onClose={onClose} onKeyDown={onKeyDown}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    Hình Ảnh / Video
                </Typography>
                <p className="item-name">
                    {item ? item.name : ''}
                </p>
                <div className="btn-wrapper">
                    <div className="item-index">
                        <IconButton aria-label="previous"
                                    onClick={() => handlePrevious()}>
                            <SkipPrevious/>
                        </IconButton>
                        <span className="index">
                            {index + 1} / {props.items.length}
                        </span>
                        <IconButton aria-label="next"
                                    onClick={() => handleNext()}>
                            <SkipNext/>
                        </IconButton>
                    </div>
                    <Divider orientation="vertical"/>
                    <IconButton onClick={onClose}>
                        <Close/>
                    </IconButton>
                </div>
            </Toolbar>
            <DialogContent>
                <div className="item-wrapper">
                    {itemLoading && (<HashLoader className="loading" color="#2196F3" size={80}/>)}
                    {item && (item.mimeType.includes('image') ? (
                        <img className="item"
                             style={{display: `${itemLoading ? 'none' : 'block'}`}}
                             alt={item.name} src={item.downloadUrl}
                             onLoadCapture={() => {setItemLoading(false)}}/>
                    ) : (
                        <video className="item" controls autoPlay
                               style={{display: `${itemLoading ? 'none' : 'block'}`}}
                               src={item.downloadUrl}
                               onLoadedData={() => {setItemLoading(false)}}/>
                    ))}
                </div>

            </DialogContent>
        </Dialog>
)
}
