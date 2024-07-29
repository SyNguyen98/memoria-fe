import "./MapAndLocation.scss";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {MapContainer, Marker, TileLayer, Tooltip as TooltipMarker, useMap} from 'react-leaflet';
import {Icon, LatLngExpression} from "leaflet";
import {
    AppBar, Divider,
    Drawer,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Toolbar,
    Typography
} from "@mui/material";
import {FilterAltOutlined, Menu} from "@mui/icons-material";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {useAppDispatch} from "../../app/hook";
import {openSidebar} from "../../reducers/SidebarReducer";
import {useCollectionQuery} from "../../custom-query/CollectionQueryHook.ts";
import {useLocationQuery} from "../../custom-query/LocationQueryHook.ts";
// Components
import AppLoader from "../../components/app-loader/AppLoader.tsx";
import ItemViewDialog from "./item-view-dialog/ItemViewDialog";
import LocationDetail from "./location-detail/LocationDetail.tsx";
import LocationList from "./location-list/LocationList.tsx";
// Models & Services
import {Location} from "../../models/Location";
import {DateUtil} from "../../utils/DateUtil";
import {Collection} from "../../models/Collection.ts";
import {isTabletOrPhone} from "../../utils/ScreenUtil.ts";

const redIcon = new Icon({
    iconUrl: 'https://github.com/SyNguyen98/image-storage/blob/main/red-marker.png?raw=true',
    iconSize: [42, 42],
    iconAnchor: [20, 18],
});

const blueIcon = new Icon({
    iconUrl: 'https://github.com/SyNguyen98/image-storage/blob/main/blue-marker.png?raw=true',
    iconSize: [40, 40],
    iconAnchor: [18, 15],
});

export default function MapAndLocation() {
    const [collectionId, setCollectionId] = useState("");
    const [collectionChose, setCollectionChose] = useState<Collection | null>(null);
    const [locationChose, setLocationChose] = useState<Location | null>(null);
    const [center, setCenter] = useState<[number, number]>([0, 0]);
    const [filterMenuOpened, setFilterMenuOpened] = useState(false);
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
            let centerLat = 0;
            let centerLng = 0;
            locationQuery.data.forEach(location => {
                centerLat += location.coordinate.latitude;
                centerLng += location.coordinate.longitude;
            });
            setCenter([centerLat / locationQuery.data.length, centerLng / locationQuery.data.length]);
        }
    }, [locationQuery.data]);

    const handleOpenFilterMenu = () => {
        setFilterMenuOpened(true);
    }

    const handleCloseCollectionMenu = () => {
        setFilterMenuOpened(false);
    }

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    /**
     * Handles the change event for the collection selection.
     *
     * This function is triggered when the user selects a different collection from the dropdown menu.
     * It updates the selected collection ID in the search parameters and resets the chosen location.
     * Additionally, it closes the filter menu.
     */
    const handleChangeCollection = (event: SelectChangeEvent) => {
        const collection = collectionQuery.data?.find(c => c.id === event.target.value);
        if (collection) {
            setSearchParams({id: collection.id ?? ""});
            setLocationChose(null);
        }
        setFilterMenuOpened(false);
    }

    /**
     * Handles the change event for the location selection.
     *
     * This function is triggered when the user selects a different location from the dropdown menu.
     * It updates the chosen location and sets the center of the map to the selected location.
     * Additionally, it closes the filter menu.
     */
    const handleChangeLocation = (event: SelectChangeEvent) => {
        const location = locationQuery.data?.find(l => l.id === event.target.value);
        if (location) {
            setLocationChose(location);
            if (isTabletOrPhone()) {
                setCenter([location.coordinate.latitude - 0.03, location.coordinate.longitude]);
            } else {
                setCenter([location.coordinate.latitude, location.coordinate.longitude]);
            }
        }
        setFilterMenuOpened(false);
    }

    const handleClickMarker = (location: Location) => {
        setLocationChose(location);
        setDialogOpened(true);
        if (isTabletOrPhone()) {
            setCenter([location.coordinate.latitude - 0.03, location.coordinate.longitude]);
        } else {
            setCenter([location.coordinate.latitude, location.coordinate.longitude]);
        }
    }

    const handleCloseDialog = () => {
        setLocationChose(null);
        setDialogOpened(false);
    }

    const handleChoseLocation = (location: Location) => {
        setLocationChose(location);
    }

    return (
        <section className="map-and-location-container">
            {/* App Bar*/}
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit"
                                onClick={handleOpenMenu}>
                        <Menu/>
                    </IconButton>
                    <Typography className="map-title" sx={{flexGrow: 1}}>
                        {t("page.map")}
                    </Typography>
                    {isTabletOrPhone() ? (
                        <IconButton className="collection-menu-btn" size="large" color="inherit"
                                    onClick={handleOpenFilterMenu}>
                            <FilterAltOutlined/>
                        </IconButton>
                    ) : (
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
                    )}
                </Toolbar>
            </AppBar>
            <div className="map-wrapper">
                {(collectionQuery.isLoading || locationQuery.isLoading) && <AppLoader/>}

                {(collectionChose && locationQuery.data) && (
                    <LocationList collection={collectionChose} locations={locationQuery.data}
                                  handleChoseLocation={handleChoseLocation}/>
                )}

                <Drawer anchor="right" open={filterMenuOpened}
                        onClose={handleCloseCollectionMenu}>
                    <div className="filter-drawer">
                        <Typography variant="h6">
                            {t("filter")}
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
                        <Divider/>
                        <FormControl className="location-select" size="small" variant="filled">
                            <InputLabel id="location-select">
                                {t("page.location")}
                            </InputLabel>
                            <Select labelId="location-select" value={locationChose?.id}
                                    onChange={handleChangeLocation}>
                                {locationQuery.data?.map(location =>
                                    <MenuItem key={location.id} value={location.id}>
                                        {location.place}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </div>
                </Drawer>

                <MapContainer className="map">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <ChangeView center={center}/>
                    {locationQuery.data?.map(location => {
                        const coordinate = location.coordinate;
                        return (
                            <Marker key={location.id}
                                    icon={location.id === locationChose?.id ? redIcon : blueIcon}
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
            {
                locationChose && (isTabletOrPhone() ? (
                    <LocationDetail location={locationChose}/>
                ) : (
                    <ItemViewDialog location={locationChose} open={dialogOpened} onClose={handleCloseDialog}/>
                ))
            }
        </section>
    )
}

type ChangeViewProps = {
    center: LatLngExpression;
}

function ChangeView(props: ChangeViewProps) {
    const map = useMap();

    useEffect(() => {
        map.setView(props.center, 13);
    }, [map, props]);

    return null;
}
