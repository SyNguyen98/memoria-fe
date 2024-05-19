import "./PhoneImageDialog.scss";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ImageGallery, {ReactImageGalleryItem} from "react-image-gallery";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";
import {useAppDispatch} from "../../../app/hook";
import {openSnackbar} from "../../../reducers/SnackbarReducer";
import {useItemQuery} from "../../../custom-query/ItemQueryHook.ts";
import {Location} from "../../../models/Location";
import {HashLoader} from "react-spinners";

type Props = {
    open: boolean;
    onClose: () => void;
    location: Location;
    index: number;
}

export default function PhoneImageDialog(props: Readonly<Props>) {
    const [images, setImages] = useState<ReactImageGalleryItem[]>([]);
    const [index, setIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const itemQuery = useItemQuery(props.location.driveItemId!, "medium");

    useEffect(() => {
        setIndex(props.index);
    }, [props]);

    useEffect(() => {
        if (itemQuery.isError) {
            dispatch(openSnackbar({type: "error", message: t("item.cannot_load")}));
        }
    }, [dispatch, itemQuery.isError, t]);

    useEffect(() => {
        if (itemQuery.data) {
            setImages(itemQuery.data.map(item => ({
                original: item.downloadUrl,
                thumbnail: item.thumbnailUrl,
                renderItem: () => (
                    item.mimeType.includes('image') ? (
                        <img className="image-gallery-image" alt={item.name} src={item.downloadUrl}/>
                    ) : (
                        <video className="image-gallery-image" controls>
                            <source src={item.downloadUrl} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                    )
                )
            })));
        }
    }, [itemQuery.data]);

    const onClose = () => {
        setIndex(0);
        props.onClose();
    }

    const handleSlide = (index: number) => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => video.pause());
        setIndex(index);
    }

    return (
        <Dialog className="phone-img-dialog" fullScreen open={props.open} onClose={onClose}>
            <DialogTitle>
                <div className="location-name">
                    {props.location.place}
                </div>
                <IconButton onClick={onClose}>
                    <Close/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {imageLoading && <HashLoader className="item-loading" color="#2196F3" size={50}/>}
                <ImageGallery items={images} lazyLoad
                              showBullets={false} showNav={false}
                              showPlayButton={false} showFullscreenButton={false}
                              showThumbnails={false}
                              startIndex={props.index}
                              onSlide={handleSlide}
                              onImageLoad={() => setImageLoading(false)}/>
            </DialogContent>
            <DialogActions>
                {index + 1} / {images.length}
            </DialogActions>
        </Dialog>
    )
}
