import "./MapAndLocation.scss";
import {Fragment, useEffect, useRef, useState} from "react";
import {MapContainer, Marker, TileLayer, Tooltip, useMap} from 'react-leaflet';
import {latLngBounds} from "leaflet";
import {AppBar, FormControl, IconButton, InputLabel, MenuItem, Select, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {useAppDispatch} from "../../app/hook";
import {openSidebar} from "../../reducers/SidebarReducer";
// Components
import AppLoader from "../../components/AppLoader";
import ItemViewDialog from "./item-view-dialog/ItemViewDialog";
// Models & Services
import {Collection} from "../../models/Collection";
import {Location} from "../../models/Location";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {LocationApi} from "../../api/LocationApi";
import {DateUtil} from "../../utils/DateUtil";
import {useCollectionQuery} from "../../custom-query/CollectionQueryHook.ts";

export default function MapAndLocation() {
    const [collectionChose, setCollectionChose] = useState<Collection | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [locationChose, setLocationChose] = useState<Location | null>(null);
    const [latCenter, setLatCenter] = useState(0);
    const [lngCenter, setLngCenter] = useState(0);
    const [dialogOpened, setDialogOpened] = useState(false);

    const collectionQuery = useCollectionQuery();

    const dispatch = useAppDispatch();

    const markerRefs = useRef({} as any);

    useEffect(() => {
        let lat = 0, lng = 0;
        if (locations.length > 0) {
            locations.forEach(location => {
                lat += location.coordinate.latitude;
                lng += location.coordinate.longitude;
            });
            setLatCenter(lat / locations.length);
            setLngCenter(lng / locations.length);
        }
    }, [locations, latCenter, lngCenter]);

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    const handleChangeCollection = (event: SelectChangeEvent) => {
        const collection = collectionQuery.data?.find(c => c.id === event.target.value);
        if (collection) {
            setCollectionChose(collection);
            LocationApi.getAllLocationsByCollectionId(collection.id!).then(res => {
                setLocations(res);
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải địa điểm"}));
            });
        }
    }

    const handleOpenDialog = (location: Location) => {
        setLocationChose(location);
        setDialogOpened(true);
    }

    const handleCloseDialog = () => {
        setDialogOpened(false);
        setLocationChose(null);
    }

    return (
        <section id="map-container" className="map-container">
            {collectionQuery.isLoading ? <AppLoader/> : (
                <Fragment>
                    {/* App Bar*/}
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton size="large" edge="start" color="inherit"
                                        aria-label="menu" sx={{mr: 2}}
                                        onClick={handleOpenMenu}>
                                <Menu/>
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                Bản Đồ
                            </Typography>
                            <FormControl className="collection-select" size="small" variant="filled">
                                <InputLabel id="collection-select">
                                    Bộ sưu tập
                                </InputLabel>
                                <Select labelId="collection-select" value={collectionChose?.id}
                                        onChange={handleChangeCollection}>
                                    {collectionQuery.data?.map(collection =>
                                        <MenuItem key={collection.id} value={collection.id}>
                                            {collection.name}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Toolbar>
                    </AppBar>
                    <MapContainer className="map" center={[latCenter, lngCenter]}>
                        <ChangeView center={[latCenter, lngCenter]} locations={locations}/>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        {locations.map(location => {
                            const coordinate = location.coordinate;
                            return (
                                <Marker key={location.id} position={[coordinate.latitude, coordinate.longitude]}
                                        ref={(ref: any) => {markerRefs.current[location.id!] = ref}}
                                        eventHandlers={{ click: () => handleOpenDialog(location) }}>
                                    <Tooltip className="marker-tooltip">
                                        <Typography variant="h6">
                                            {location.place}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            {DateUtil.renderDateTime(location)}
                                        </Typography>
                                        <Typography variant="body1">
                                            {location.description}
                                        </Typography>
                                    </Tooltip>
                                </Marker>
                            )
                        })}
                    </MapContainer>

                    <ItemViewDialog open={dialogOpened} onClose={handleCloseDialog} location={locationChose}/>
                </Fragment>
            )}
        </section>
    )
}

type ChangeViewProps = {
    center: any;
    locations: Location[];
}

function ChangeView({center, locations}: ChangeViewProps) {
    const map = useMap();
    if (locations.length > 0) {
        map.setView(center);
        const markerBounds = latLngBounds([]);
        locations.forEach(location => {
            const coordinate = location.coordinate;
            markerBounds.extend([coordinate.latitude, coordinate.longitude])
        })
        map.fitBounds(markerBounds)
    } else {
        map.setView([10.788393847875726, 106.69381039515127], 10)
    }
    return null;
}
