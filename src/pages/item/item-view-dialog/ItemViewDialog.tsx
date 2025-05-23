import "./ItemViewDialog.scss";
import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, Divider, IconButton, Toolbar, Typography} from "@mui/material";
import {Close, SkipNext, SkipPrevious} from "@mui/icons-material";
import {Item} from "../../../models/Item";
import {useTranslation} from "react-i18next";
import {isTabletOrPhone} from "../../../utils/ScreenUtil.ts";
import Slider from "react-slick";
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
    const {t} = useTranslation();

    useEffect(() => {
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

    const onClose = () => {
        setItem(null);
        setIndex(-1);
        props.onClose();
    }

    const handleSlide = (index: number) => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => video.pause());
        setIndex(index);
    }

    return (
        <Dialog className="item-view-dialog" fullScreen
                open={props.open} onClose={onClose} onKeyDown={onKeyDown}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    {t("item.img_video")}
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
                <HashLoader className="item-loading" color="#2196F3" size={50}/>
                {isTabletOrPhone() ? (
                    <Slider arrows={false} dots={false} infinite={true}
                            slidesToShow={1} slidesToScroll={1} initialSlide={index}
                            speed={500}
                            lazyLoad="ondemand"
                            afterChange={handleSlide}>
                        {props.items.map(item => {
                            if (item.mimeType.includes('image')) {
                                return (
                                    <img key={item.id} alt={item.name} src={item.downloadUrl}/>
                                );
                            }
                            return (
                                <video key={item.id} controls>
                                    <source src={item.downloadUrl} type="video/mp4"/>
                                    Your browser does not support the video tag.
                                </video>
                            );
                        })}
                    </Slider>
                ) : (
                    <div className="item-wrapper">
                        {item && (item.mimeType.includes('image') ? (
                            <img alt={item.name} src={item.downloadUrl}/>
                        ) : (
                            <video controls>
                                <source src={item.downloadUrl} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
