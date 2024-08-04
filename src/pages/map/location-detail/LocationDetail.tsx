import "./LocationDetail.scss";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {useItemQuery} from "../../../custom-query/ItemQueryHook.ts";
import {IconButton, ImageList, ImageListItem} from "@mui/material";
import {AccessTime, HorizontalRule} from "@mui/icons-material";
import {Location} from "../../../models/Location";
import {Item} from "../../../models/Item.ts";
import {useSwipeable} from "react-swipeable";
import {DateUtil} from "../../../utils/DateUtil.ts";
import PhoneImageDialog from "../phone-img-view-dialog/PhoneImageDialog.tsx";
import {isTabletOrPhone} from "../../../utils/ScreenUtil.ts";
import {HashLoader} from "react-spinners";

type Props = {
    location: Location;
}

const MAX_HEIGHT = '60svh';

function LocationDetail(props: Readonly<Props>) {
    const [items, setItems] = useState<Item[]>([]);
    const [showDetail, setShowDetail] = useState(true);
    const [minHeight, setMinHeight] = useState(0);
    const [imageListTop, setImageListTop] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const detailRef = useRef<HTMLDivElement>(null);

    const itemQuery = useItemQuery(props.location.driveItemId!, isTabletOrPhone() ? "small" : "medium");

    const detailSwipeHandlers = useSwipeable({
        onSwipedUp: () => {
            setShowDetail(true);
        },
        onSwipedDown: () => {
            setShowDetail(false);
        }
    });

    const imagesSwipeHandler = useSwipeable({
        onSwipedDown: () => {
            if (imageListTop) {
                setShowDetail(false);
            }
        }
    })

    useEffect(() => {
        const detailHeight = detailRef.current ? detailRef.current.offsetHeight : 0;
        setMinHeight(detailHeight + 8);
        setShowDetail(true);
    }, [props]);

    useEffect(() => {
        if (itemQuery.data) {
            setItems(itemQuery.data);
        }
    }, [itemQuery.data]);

    const handleShowDetail = () => {
        setShowDetail(!showDetail);
    }

    const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
        setImageListTop(false);
        if (event.currentTarget.scrollTop === 0) {
            setImageListTop(true);
        }
    }

    const handleOpenDialog = (index: number) => {
        setIndex(index);
        setDialogOpen(true);
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    }

    return (
        <Fragment>
            <div className="location-detail-container"
                 style={{height: showDetail ? MAX_HEIGHT : `${minHeight}px`}}>
                <div className="detail-wrapper" {...detailSwipeHandlers}>
                    <IconButton onClick={handleShowDetail}>
                        <HorizontalRule/>
                    </IconButton>
                    <div ref={detailRef}>
                        <div className="location-title">
                            {props.location.place}
                        </div>
                        <div className="location-time">
                            <AccessTime/>&nbsp;
                            <div className="text">{DateUtil.renderDateTime(props.location)}</div>
                        </div>
                        <div className="location-description">
                            {props.location.description}
                        </div>
                    </div>
                </div>
                {showDetail && (
                    itemQuery && itemQuery.isLoading ? (
                        <HashLoader className="hash-loader" color="#2196F3" size={60}/>
                    ) : (
                        <ImageList className="image-list" variant="quilted" {...imagesSwipeHandler}
                                   cols={3} gap={6}
                                   style={{height: `calc(${MAX_HEIGHT} - ${minHeight + 16}px`}}
                                   onScroll={handleScroll}>
                            {items.map((item, i) =>
                                <ImageListItem key={item.id} onClick={() => handleOpenDialog(i)}>
                                    <img srcSet={`${item.thumbnailUrl}?fit=crop&auto=format&dpr=2 2x`}
                                         src={`${item.thumbnailUrl}?fit=crop&auto=format`}
                                         alt={item.name}
                                         loading="lazy"/>
                                </ImageListItem>
                            )}
                        </ImageList>
                    )
                )}
            </div>

            <PhoneImageDialog open={dialogOpen} onClose={handleCloseDialog} location={props.location} index={index}/>
        </Fragment>
    )
}

export default LocationDetail;