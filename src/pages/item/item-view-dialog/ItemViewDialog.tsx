import "./ItemViewDialog.scss";
import React, {useEffect, useState} from "react";
import {AppBar, Dialog, DialogContent, Divider, IconButton, Toolbar, Typography} from "@mui/material";
import {Close, SkipNext, SkipPrevious} from "@mui/icons-material";
import {Item} from "../../../models/Item";

type Props = {
    open: boolean;
    onClose: () => void;
    items: Item[];
    itemIndex: number;
}

export default function ItemViewDialog(props: Props) {
    const [item, setItem] = useState<Item | null>(null);
    const [index, setIndex] = useState(-1);

    useEffect(() => {
        setIndex(props.itemIndex);
        setItem(props.items[props.itemIndex]);
    }, [props]);

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        console.log(event.key)
        switch (event.key) {
            case "ArrowRight":
                handleNext();
                break;
            case "ArrowLeft":
                handlePrevious();
                break;
        }
    }

    const handlePrevious = () => {
        if (index === 0) {
            setIndex(props.items.length - 1);
            setItem(props.items[props.items.length - 1]);
        } else {
            setIndex(index - 1);
            setItem(props.items[index - 1]);
        }
    }

    const handleNext = () => {
        if (index === props.items.length - 1) {
            setIndex(0);
            setItem(props.items[0]);
        } else {
            setIndex(index + 1);
            setItem(props.items[index + 1]);
        }
    }

    return (
        <Dialog className="item-view-dialog" fullScreen
                open={props.open} onClose={props.onClose} onKeyDown={onKeyDown}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className="page-title" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Hình Ảnh / Video
                    </Typography>
                    <div className="image-index">
                        <IconButton aria-label="previous"
                                    onClick={() => handlePrevious()} >
                            <SkipPrevious />
                        </IconButton>
                        <span className="index">
                            {index + 1} / {props.items.length}
                        </span>
                        <IconButton aria-label="next"
                                    onClick={() => handleNext()}>
                            <SkipNext />
                        </IconButton>
                    </div>
                    <Divider orientation="vertical" />
                    <IconButton aria-label="close" onClick={props.onClose}>
                        <Close />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent>
                {item ? item.mimeType.includes('image') ? (
                    <img className="item" alt={item.name} src={item.downloadUrl} />
                ) : (
                    <video className="item" controls autoPlay src={item.downloadUrl} />
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
