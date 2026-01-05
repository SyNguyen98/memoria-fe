import "./LocationList.scss";
import {useEffect} from "react";
import {Button, Card, CardActions, CardContent, Divider, Tooltip, Typography} from "@mui/material";
import {AccessTime, KeyboardArrowRight, Room} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {HashLoader} from "react-spinners";
import {DateUtil} from "@utils/DateUtil.ts";
import {Collection} from "@models/Collection.ts";
import {Location} from "@models/Location.ts";

type Props = {
    collection: Collection | null;
    locations: Location[] | undefined;
    handleChoseLocation: (location: Location) => void;
    handleOpenLocationItem: (location: Location) => void;
}

function LocationList(props: Readonly<Props>) {
    const {t} = useTranslation();

    useEffect(() => {
        if (props.locations) {
            props.locations.sort((a, b) => {
                if (a.takenYear !== b.takenYear) return b.takenYear - a.takenYear;
                if (a.takenMonth !== b.takenMonth) return (b.takenMonth ?? 0) - (a.takenMonth ?? 0);
                if (a.takenDay !== b.takenDay) return (b.takenDay ?? 0) - (a.takenDay ?? 0);
                if (a.takenTime !== b.takenTime) return (b.takenTime ?? '').localeCompare(a.takenTime ?? '');
                return 0;
            });
        }
    }, [props.locations]);

    return (
        <div className="location-list-container">
            <Typography variant="h6" className="list-title">
                {t('map.location_list_title')}
            </Typography>
            <Divider/>
            {/*<Typography variant="h6" className="collection-name">*/}
            {/*    {props.collection ? props.collection.name : ""}*/}
            {/*</Typography>*/}
            {/*<Typography variant="subtitle1" className="collection-description">*/}
            {/*    {props.collection ? props.collection.description : ""}*/}
            {/*</Typography>*/}
            {/*<Divider/>*/}
            {props.locations ? (
                props.locations.map(location => (
                    <Card key={location.id} onClick={() => props.handleChoseLocation(location)}>
                        <CardContent>
                            <Tooltip title={location.place}>
                                <div className="location-place">
                                    <Room/>&nbsp;
                                    <div className="text">{location.place}</div>
                                </div>
                            </Tooltip>
                            <div className="location-time">
                                <AccessTime/>&nbsp;
                                <div className="text">{DateUtil.renderDateTime(location)}</div>
                            </div>
                            {location.description !== '' && (
                                <Typography variant="body1" className="location-description">
                                    {location.description}
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" variant="text"
                                    onClick={() => props.handleOpenLocationItem(location)}>
                                {t("button.view_item")}
                                <KeyboardArrowRight/>
                            </Button>
                        </CardActions>
                    </Card>
                ))
            ) : (
                <HashLoader className="location-loading" color="#2196F3" size={40}/>
            )}
        </div>
    );
}

export default LocationList;