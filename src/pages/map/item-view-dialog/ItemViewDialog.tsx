import "./ItemViewDialog.scss";
import React, {useEffect, useState} from "react";
import {Dialog} from "@mui/material";
import {KeyboardBackspace} from '@mui/icons-material';
import {useAppDispatch} from "../../../app/hook";
import {openSnackbar} from "../../../reducers/SnackbarReducer";
import {Item} from "../../../models/Item";
import {ItemApi} from "../../../api/ItemApi";
import {Location} from "../../../models/Location";

type Props = {
    open: boolean;
    onClose: () => void;
    location: Location | null;
}

export default function ImageDialog(props: Readonly<Props>) {
    const [items, setItems] = useState<Item[]>([]);
    const [itemChose, setItemChose] = useState<Item | null>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.location) {
            ItemApi.getAllItemsByDriveItemId(props.location.driveItemId!).then(res => {
                setItems(res);
                setItemChose(res[0]);
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải hình ảnh"}));
            })
        }
    }, [props.open, props.location, dispatch]);

    const handleChangeItem = (item: Item) => {
        setItemChose(item);
    }

    const onWheel = (event: any, elementId: string) => {
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
        props.onClose();
    }

    return (
        <Dialog id="image-viewer-dialog" fullScreen open={props.open} onClose={onClose}>
            {props.location && (
                <div className="dialog-header">
                    <span className="dialog-title">
                        <KeyboardBackspace onClick={onClose}/>
                        <p>{props.location.place}</p>
                    </span>
                </div>
            )}
            <div className="dialog-body">
                {itemChose ? (itemChose.mimeType.includes('image') ? (
                    <img className="item-chose" alt={itemChose.name} src={itemChose.downloadUrl}/>
                ) : (
                    <video className="item-chose" controls autoPlay src={itemChose.downloadUrl}/>
                )) : null}
            </div>
            <div className="dialog-footer">
                <div id="item-list" className="item-list" onWheel={event => onWheel(event, 'item-list')}>
                    {items.map((item, index) =>
                        (item.mimeType.includes('image') ? (
                            <img key={index} alt={item.name} src={item.downloadUrl}
                                 onClick={() => handleChangeItem(item)}/>
                        ) : (
                            <video key={index} src={item.downloadUrl}
                                   onClick={() => handleChangeItem(item)}/>
                        ))
                    )}
                </div>
            </div>
        </Dialog>
    )
}
