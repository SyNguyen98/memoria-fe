import "./PhoneImageDialog.scss";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";
import Slider from "react-slick";
import {HashLoader} from "react-spinners";
import {useAppDispatch} from "../../../app/hook";
import {openSnackbar} from "../../../reducers/SnackbarReducer";
import {useItemQuery} from "../../../custom-query/ItemQueryHook.ts";
import {Location} from "../../../models/Location";
import HeicImg from "../../../components/heic-img/HeicImg.tsx";

type Props = {
    open: boolean;
    onClose: () => void;
    location: Location;
    index: number;
}

export default function PhoneImageDialog(props: Readonly<Props>) {
    const [index, setIndex] = useState(0);
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const itemQuery = useItemQuery(props.location.id!, "medium");

    useEffect(() => {
        setIndex(props.index);
    }, [props]);

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
                <HashLoader className="item-loading" color="#2196F3" size={50}/>
                <Slider arrows={false} dots={false} infinite={true}
                        slidesToShow={1} slidesToScroll={1} initialSlide={index}
                        speed={500}
                        lazyLoad="ondemand"
                        afterChange={handleSlide}>
                    {itemQuery.data?.map(item => {
                        if (item.mimeType.includes('image')) {
                            return item.mimeType.includes('heic') ? (
                                <HeicImg key={item.id} alt={item.name} url={item.downloadUrl}/>
                            ) : (
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
            </DialogContent>
            <DialogActions>
                {index + 1} / {itemQuery.data?.length}
            </DialogActions>
        </Dialog>
    )
}
