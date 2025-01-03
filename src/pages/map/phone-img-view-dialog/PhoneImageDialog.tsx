import "./PhoneImageDialog.scss";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";
import Slider from "react-slick";
import {HashLoader} from "react-spinners";
import {useAppDispatch} from "../../../app/hook";
import {openSnackbar} from "../../../reducers/SnackbarReducer";
import {useItemQuery} from "../../../custom-query/ItemQueryHook.ts";
import {Location} from "../../../models/Location";

type Props = {
    open: boolean;
    onClose: () => void;
    location: Location;
    index: number;
}

export default function PhoneImageDialog(props: Readonly<Props>) {
    const [index, setIndex] = useState(0);
    const sliderRef = useRef<Slider | null>(null);

    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const itemQuery = useItemQuery(props.location.driveItemId!, "medium");

    useEffect(() => {
        setIndex(props.index);
        setTimeout(() => {
            if (sliderRef.current) {
                sliderRef.current.slickGoTo(props.index);
            }
        }, 100);
    }, [props, sliderRef.current]);

    useEffect(() => {
        if (itemQuery.isError) {
            dispatch(openSnackbar({type: "error", message: t("item.cannot_load")}));
        }
    }, [dispatch, itemQuery.isError, t]);

    const onClose = () => {
        setIndex(1);
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
                {<HashLoader className="item-loading" color="#2196F3" size={50}/>}
                <Slider ref={sliderRef}
                        arrows={false} dots={false} infinite={true}
                        slidesToShow={1} slidesToScroll={1}
                        speed={500}
                        lazyLoad="progressive"
                        afterChange={handleSlide}>
                    {itemQuery.data?.map(item =>
                        item.mimeType.includes('image') ? (
                            <img key={item.id} alt={item.name} src={item.downloadUrl}/>
                        ) : (
                            <video key={item.id} controls>
                                <source src={item.downloadUrl} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        )
                    )}
                </Slider>
            </DialogContent>
            <DialogActions>
                {index + 1} / {itemQuery.data?.length}
            </DialogActions>
        </Dialog>
    )
}
