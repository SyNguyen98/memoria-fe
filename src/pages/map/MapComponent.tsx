import "./MapComponent.scss";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {MapContainer, Marker, TileLayer, Tooltip, useMap} from 'react-leaflet';
import {latLngBounds} from "leaflet";
import {AppBar, FormControl, IconButton, InputLabel, MenuItem, Select, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {openSidebar} from "../../reducers/SidebarReducer";
// Components
import AppLoader from "../../components/AppLoader";
// Models & Services
import {Collection} from "../../models/Collection";
import {Location} from "../../models/Location";
import {CollectionApi} from "../../api/CollectionApi";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {LocationApi} from "../../api/LocationApi";
import ItemViewDialog from "./item-view-dialog/ItemViewDialog";

function MapComponent() {
    const [isLoading, setLoading] = useState(false);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [collectionChose, setCollectionChose] = useState<Collection | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [locationChose, setLocationChose] = useState<Location | null>(null);
    const [latCenter, setLatCenter] = useState(0);
    const [lngCenter, setLngCenter] = useState(0);
    const [dialogOpened, setDialogOpened] = useState(false);

    const currentUser = useAppSelector(state => state.user.value);
    const dispatch = useAppDispatch();

    const markerRefs = useRef({} as any);

    useEffect(() => {
        setLoading(true);
        if (currentUser) {
            CollectionApi.getAllCollectionsHavingAccess().then(res => {
                setCollections(res);
                setLoading(false);
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải bộ sưu tập"}));
                setLoading(false);
            });
        }
    }, [currentUser, dispatch]);

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
        const collection = collections.find(c => c.id === event.target.value);
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
            {isLoading ? <AppLoader/> : (
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
                                    {collections.length > 0 && collections.map(collection =>
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

// function MyComponent() {
//     const map = useMapEvents({
//         click: (event: any) => {
//             map.locate()
//             console.log(event)
//         },
//         locationfound: (location) => {
//             console.log('location found:', location)
//         },
//     })
//     return null
// }

export default MapComponent;
