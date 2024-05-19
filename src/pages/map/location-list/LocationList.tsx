import "./LocationList.scss";
import {Card, CardContent, Divider, Tooltip, Typography} from "@mui/material";
import {AccessTime, Room} from "@mui/icons-material";
import {DateUtil} from "../../../utils/DateUtil.ts";
import {Collection} from "../../../models/Collection.ts";
import {Location} from "../../../models/Location";

type Props = {
    collection: Collection;
    locations: Location[];
    handleChoseLocation: (location: Location) => void;
}

function LocationList(props: Readonly<Props>) {

    return (
        <div className="location-list-container">
            <Typography variant="h6" className="collection-name">
                {props.collection.name}
            </Typography>
            <Typography variant="subtitle1" className="collection-description">
                {props.collection.description}
            </Typography>
            <Divider/>
            {props.locations.map(location => (
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
                </Card>
            ))}
        </div>
    );
}

export default LocationList;