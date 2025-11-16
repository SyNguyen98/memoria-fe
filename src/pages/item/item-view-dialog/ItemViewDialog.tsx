import "./ItemViewDialog.scss";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {Button, Dialog, DialogContent, Divider, IconButton, Toolbar, Typography} from "@mui/material";
import {Close, SkipNext, SkipPrevious} from "@mui/icons-material";
import {Item} from "@models/Item.ts";
import {useTranslation} from "react-i18next";
import {isTabletOrPhone} from "@utils/ScreenUtil.ts";
import Slider from "react-slick";
import {HashLoader} from "react-spinners";
import {ReactPhotoSphereViewer, ViewerAPI} from "react-photo-sphere-viewer";
import {GyroscopePlugin} from "@photo-sphere-viewer/gyroscope-plugin";
import {VideoPlugin} from "@photo-sphere-viewer/video-plugin";
import {EquirectangularVideoAdapter} from "@photo-sphere-viewer/equirectangular-video-adapter";
import 'react-photo-sphere-viewer/dist/index.css';
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/video-plugin/index.css";

type Props = {
    open: boolean;
    onClose: () => void;
    items: Item[];
    itemIndex: number;
}

export default function ItemViewDialog(props: Readonly<Props>) {
    const [item, setItem] = useState<Item | null>(null);
    const [index, setIndex] = useState(-1);
    const [img360, setImg360] = useState<Item | null>(null);

    const psvRef = useRef<ViewerAPI | null>(null);

    const {t} = useTranslation();

    useEffect(() => {
        setIndex(props.itemIndex);
        setItem(props.items[props.itemIndex]);
    }, [props]);

    const handleDestroyVideoPSV = () => {
        if (psvRef.current) {
            const videoPlugin = psvRef.current.getPlugin(VideoPlugin) as VideoPlugin;
            if (videoPlugin) {
                videoPlugin.pause();
            }
        }
    }

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
        handleDestroyVideoPSV();
        if (index === 0) {
            setIndex(props.items.length - 1);
            setItem(props.items[props.items.length - 1]);
        } else {
            setIndex(index - 1);
            setItem(props.items[index - 1]);
        }
    }

    const handleNext = () => {
        handleDestroyVideoPSV();
        if (index === props.items.length - 1) {
            setIndex(0);
            setItem(props.items[0]);
        } else {
            setIndex(index + 1);
            setItem(props.items[index + 1]);
        }
    }

    const onClose = () => {
        handleDestroyVideoPSV();
        setItem(null);
        setIndex(-1);
        props.onClose();
    }

    const handleSlide = (index: number) => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => video.pause());
        setIndex(index);
    }

    const handleOpenImg360Dialog = (item: Item) => {
        setImg360(item);
    }

    const handleCloseImg360Dialog = () => {
        handleDestroyVideoPSV();
        setImg360(null);
    }

    return (
        <>
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
                                const isImage = item.mimeType.includes('image');
                                const is360 = item.name.startsWith(isImage ? "IMG360" : "VID360");

                                return (
                                    <Fragment key={item.id}>
                                        {isImage ? (
                                            <img style={{width: "100%", height: "auto"}} alt={item.name} src={item.downloadUrl}/>
                                        ) : (
                                            <video style={{width: "100%", height: "auto"}} controls>
                                                <source src={item.downloadUrl} type="video/mp4"/>
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        {is360 && (
                                            <Button
                                                style={{
                                                    position: "fixed",
                                                    bottom: "10px",
                                                    transform: "translate(-180%, 0)"
                                                }}
                                                onClick={() => handleOpenImg360Dialog(item)}
                                            >
                                                Open in 360 Viewer
                                            </Button>
                                        )}
                                    </Fragment>
                                )
                            })}
                        </Slider>
                    ) : (
                        <div className="item-wrapper">
                            {item && (item.mimeType.includes('image') ? (
                                item.name.startsWith("IMG360") ? (
                                    <ReactPhotoSphereViewer width="100%" height="100%" defaultZoomLvl={0}
                                                            src={item.downloadUrl}
                                                            plugins={[GyroscopePlugin]}/>
                                ) : (
                                    <img alt={item.name} src={item.downloadUrl}/>
                                )
                            ) : (
                                item.name.startsWith("VID360") ? (
                                    <ReactPhotoSphereViewer width="100%" height="100%" defaultZoomLvl={0}
                                                            ref={psvRef}
                                                            src={item.downloadUrl}
                                                            panorama={{source: item.downloadUrl}}
                                                            adapter={EquirectangularVideoAdapter}
                                                            plugins={[VideoPlugin]}/>
                                ) : (
                                    <video controls>
                                        <source src={item.downloadUrl} type="video/mp4"/>
                                        Your browser does not support the video tag.
                                    </video>
                                )
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {img360 && (
                <Dialog className="img-360-dialog" open={true}
                        onClose={handleCloseImg360Dialog} fullScreen>
                    <IconButton aria-label="close" onClick={handleCloseImg360Dialog}>
                        <Close/>
                    </IconButton>
                    <DialogContent style={{padding: "0"}}>
                        {img360.mimeType.includes('image') ? (
                            <ReactPhotoSphereViewer width="100%" height="100%" defaultZoomLvl={0}
                                                    src={img360.downloadUrl}
                                                    plugins={[GyroscopePlugin]}/>
                        ) : (
                            <ReactPhotoSphereViewer width="100%" height="100%" defaultZoomLvl={0}
                                                    ref={psvRef}
                                                    src={img360.downloadUrl}
                                                    panorama={{source: img360.downloadUrl}}
                                                    adapter={EquirectangularVideoAdapter}
                                                    plugins={[VideoPlugin]}/>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
