import "./MapAndLocation.scss";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {MapContainer, Marker, TileLayer, Tooltip as TooltipMarker, useMap} from 'react-leaflet';
import {Icon, LatLngBounds, latLngBounds} from "leaflet";
import {AppBar, FormControl, IconButton, InputLabel, MenuItem, Select, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {useAppDispatch} from "../../app/hook";
import {openSidebar} from "../../reducers/SidebarReducer";
import {useCollectionQuery} from "../../custom-query/CollectionQueryHook.ts";
import {useLocationQuery} from "../../custom-query/LocationQueryHook.ts";
// Components
import AppLoader from "../../components/app-loader/AppLoader.tsx";
import ItemViewDialog from "./item-view-dialog/ItemViewDialog";
import LocationDetail from "./location-detail/LocationDetail.tsx";
// Models & Services
import {Location} from "../../models/Location";
import {DateUtil} from "../../utils/DateUtil";
import {Collection} from "../../models/Collection.ts";
import {isTabletOrPhone} from "../../utils/ScreenUtil.ts";
import LocationList from "./location-list/LocationList.tsx";

const greenIcon = new Icon({
    iconUrl: 'https://i.ibb.co/k9VW1GL/green-marker.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const blueIcon = new Icon({
    iconUrl: 'https://i.ibb.co/drCJ75Z/blue-marker.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

export default function MapAndLocation() {
    const [collectionId, setCollectionId] = useState("");
    const [collectionChose, setCollectionChose] = useState<Collection | null>(null);
    const [locationChose, setLocationChose] = useState<Location | null>(null);
    const [center, setCenter] = useState<[latCenter: number, lngCenter: number]>([10.788393847875726, 106.69381039515127]);
    const [zoom, setZoom] = useState(13);
    const [bounds, setBounds] = useState<LatLngBounds | null>(null);
    const [dialogOpened, setDialogOpened] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const collectionQuery = useCollectionQuery();
    const locationQuery = useLocationQuery(collectionId);

    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setCollectionId(id);
            const collection = collectionQuery.data?.find(c => c.id === id);
            if (collection) {
                setCollectionChose(collection);
            }
        } else {
            const collection = collectionQuery.data?.[0];
            if (collection) {
                setSearchParams({id: collection.id ?? ""});
            }
        }
    }, [collectionQuery.data, searchParams, setSearchParams]);

    useEffect(() => {
        if (locationQuery.data && locationQuery.data.length > 0) {
            let lat = 0, lng = 0;
            const markerBounds = latLngBounds([]);
            locationQuery.data.forEach(location => {
                lat = lat + location.coordinate.latitude;
                lng = lng + location.coordinate.longitude;
                markerBounds.extend([location.coordinate.latitude, location.coordinate.longitude]);
            });
            setCenter([lat / locationQuery.data.length, lng / locationQuery.data.length]);
            setBounds(markerBounds);
        }
    }, [locationQuery.data]);

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    const handleChangeCollection = (event: SelectChangeEvent) => {
        const collection = collectionQuery.data?.find(c => c.id === event.target.value);
        if (collection) {
            setSearchParams({id: collection.id ?? ""});
            setLocationChose(null);
        }
    }

    const handleClickMarker = (location: Location) => {
        setLocationChose(location);
        setBounds(null);
        if (isTabletOrPhone()) {
            setCenter([location.coordinate.latitude - 0.04, location.coordinate.longitude]);
            setZoom(13);
        } else {
            setDialogOpened(true);
            setCenter([location.coordinate.latitude, location.coordinate.longitude]);
            setZoom(15);
        }
    }

    const handleCloseDialog = () => {
        setLocationChose(null);
        setDialogOpened(false);
    }

    const handleChoseLocation = (location: Location) => {
        setLocationChose(location);
        setCenter([location.coordinate.latitude, location.coordinate.longitude]);
        setZoom(15);
        setBounds(null);
    }

    return (
        <section id="map-container" className="map-and-location-container">
            {/* App Bar*/}
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit"
                                onClick={handleOpenMenu}>
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {t("page.map")}
                    </Typography>
                    <FormControl className="collection-select" size="small" variant="filled">
                        <InputLabel id="collection-select">
                            {t("page.collection")}
                        </InputLabel>
                        <Select labelId="collection-select" value={collectionId}
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
            <div className="map-wrapper">
                {(collectionQuery.isLoading || locationQuery.isLoading) && <AppLoader/>}

                {(collectionChose && locationQuery.data) && (
                    <LocationList collection={collectionChose} locations={locationQuery.data}
                                  handleChoseLocation={handleChoseLocation}/>
                )}

                <MapContainer className="map" center={center}>
                    <ChangeView center={center} zoom={zoom} bounds={bounds}/>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    {locationQuery.data?.map(location => {
                        const coordinate = location.coordinate;
                        return (
                            <Marker key={location.id}
                                    icon={location.id === locationChose?.id ? greenIcon : blueIcon}
                                    position={[coordinate.latitude, coordinate.longitude]}
                                    eventHandlers={{click: () => handleClickMarker(location)}}>
                                {!isTabletOrPhone() && (
                                    <TooltipMarker className="marker-tooltip">
                                        <Typography variant="h6">
                                            {location.place}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            {DateUtil.renderDateTime(location)}
                                        </Typography>
                                        <Typography variant="body1">
                                            {location.description}
                                        </Typography>
                                    </TooltipMarker>
                                )}
                            </Marker>
                        )
                    })}
                </MapContainer>
            </div>
            {locationChose && (isTabletOrPhone() ? (
                <LocationDetail location={locationChose}/>
            ) : (
                <ItemViewDialog location={locationChose} open={dialogOpened} onClose={handleCloseDialog}/>
            ))}
        </section>
    )
}

type ChangeViewProps = {
    center: [latCenter: number, lngCenter: number];
    zoom: number | null;
    bounds: LatLngBounds | null;
}

function ChangeView(props: ChangeViewProps) {
    const map = useMap();
    if (props.zoom) {
        map.setView(props.center, props.zoom);
    } else {
        map.setView(props.center);
    }
    if (props.bounds) {
        map.fitBounds(props.bounds);
    }
    return null;
}
