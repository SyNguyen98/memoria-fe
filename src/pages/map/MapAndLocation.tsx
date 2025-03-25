import "./MapAndLocation.scss";
import {Fragment, useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {useTranslation} from "react-i18next";
import {MapContainer, Marker, TileLayer, Tooltip as TooltipMarker, useMap} from 'react-leaflet';
import {Icon, LatLngBoundsExpression, LatLngExpression} from "leaflet";
import {AppBar, FormControl, IconButton, InputLabel, MenuItem, Select, Toolbar, Typography} from "@mui/material";
import {FilterAltOutlined, Menu} from "@mui/icons-material";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {useAppDispatch} from "../../app/hook";
import {openSidebar} from "../../reducers/SidebarReducer";
import {useCollectionQuery, useYearsOfCollectionQuery} from "../../custom-query/CollectionQueryHook.ts";
import {useAllLocationsQuery} from "../../custom-query/LocationQueryHook.ts";
// Components
import AppLoader from "../../components/app-loader/AppLoader.tsx";
import ItemViewDialog from "./item-view-dialog/ItemViewDialog";
import LocationDetail from "./location-detail/LocationDetail.tsx";
import LocationList from "./location-list/LocationList.tsx";
import FilterDrawer from "./filter-drawer/FilterDrawer.tsx";
// Models & Services
import {Collection} from "../../models/Collection.ts";
import {Location} from "../../models/Location";
import {DateUtil} from "../../utils/DateUtil";
import {isTabletOrPhone} from "../../utils/ScreenUtil.ts";

const redIcon = new Icon({
    iconUrl: `${import.meta.env.BASE_URL}red-marker.webp`,
    iconSize: [42, 42],
    iconAnchor: [20, 18],
});

const blueIcon = new Icon({
    iconUrl: `${import.meta.env.BASE_URL}blue-marker.webp`,
    iconSize: [40, 40],
    iconAnchor: [18, 15],
});

export default function MapAndLocation() {
    const [collectionId, setCollectionId] = useState("all");
    const [year, setYear] = useState("all");
    const [collectionChose, setCollectionChose] = useState<Collection | null>(null);
    const [locationChose, setLocationChose] = useState<Location | null>(null);
    const [center, setCenter] = useState<[number, number]>([0, 0]);
    const [zoom, setZoom] = useState(13);
    const [bounds, setBounds] = useState<LatLngBoundsExpression | undefined>();
    const [filterMenuOpened, setFilterMenuOpened] = useState(false);
    const [dialogOpened, setDialogOpened] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const collectionQuery = useCollectionQuery({unpaged: true});
    const locationQuery = useAllLocationsQuery(collectionId, year);
    const yearsQuery = useYearsOfCollectionQuery();

    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        document.title = `MEMORIA | ${t("page.map")}`;
    }, [t]);

    useEffect(() => {
        const id = searchParams.get("id");
        const year = searchParams.get("year");
        if (id) {
            setCollectionId(id);
            const collection = collectionQuery.data?.data.find(c => c.id === id);
            if (collection) {
                setCollectionChose(collection);
            }
        } else {
            setCollectionId("all");
            setCollectionChose(null);
        }
        setYear(year || "all");
    }, [collectionQuery.data, searchParams]);

    useEffect(() => {
        if (locationQuery.data && locationQuery.data.length > 0) {
            setBounds(locationQuery.data.map(location => [location.coordinate.latitude, location.coordinate.longitude]));
        }
    }, [locationQuery.data]);

    const handleOpenFilterMenu = () => {
        setFilterMenuOpened(true);
    }

    const handleCloseFilterMenu = () => {
        setFilterMenuOpened(false);
    }

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    const handleChangeYear = (event: SelectChangeEvent) => {
        const year = event.target.value
        const params: Record<string, string> = collectionId !== "all" ? {id: collectionId} : {};
        if (year !== "all") {
            params.year = year
        }
        setSearchParams(params);
    }

    /**
     * Handles the change event for the collection selection.
     *
     * This function is triggered when the user selects a different collection from the dropdown menu.
     * It updates the selected collection ID in the search parameters and resets the chosen location.
     * Additionally, it closes the filter menu.
     */
    const handleChangeCollection = (event: SelectChangeEvent) => {
        const collectionId = event.target.value;
        const params: Record<string, string> = year !== "all" ? {year} : {};
        if (collectionId !== "all") {
            params.id = collectionId
        }
        setSearchParams(params);
        setLocationChose(null);
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
                setCenter([location.coordinate.latitude - 0.01, location.coordinate.longitude]);
                setZoom(15);
            } else {
                setCenter([location.coordinate.latitude, location.coordinate.longitude]);
            }
        }
        setBounds(undefined);
        setFilterMenuOpened(false);
    }

    /**
     * Handles the click event for the marker.
     * It sets the chosen location and opens the dialog to display the location details.
     * Additionally, it sets the center of the map to the selected location.
     */
    const handleClickMarker = (location: Location) => {
        setLocationChose(location);
        setDialogOpened(true);
        if (isTabletOrPhone()) {
            setCenter([location.coordinate.latitude - 0.01, location.coordinate.longitude]);
            setZoom(15);
        } else {
            setCenter([location.coordinate.latitude, location.coordinate.longitude]);
            setZoom(16);
        }
        setBounds(undefined);
    }

    const handleCloseDialog = () => {
        setLocationChose(null);
        setDialogOpened(false);
    }

    const handleChoseLocation = (location: Location) => {
        setCenter([location.coordinate.latitude, location.coordinate.longitude]);
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
                        <Fragment>
                            <FormControl className="year-select" size="small" variant="filled">
                                <InputLabel id="year-select">
                                    {t("input.year")}
                                </InputLabel>
                                <Select labelId="year-select"
                                        variant="filled"
                                        value={year}
                                        onChange={handleChangeYear}>
                                    <MenuItem key="all" value="all">
                                        {t("select.all")}
                                    </MenuItem>
                                    {yearsQuery.data?.sort((a, b) => a - b).map(year =>
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            <FormControl className="collection-select" size="small" variant="filled">
                                <InputLabel id="collection-select">
                                    {t("page.collection")}
                                </InputLabel>
                                <Select labelId="collection-select"
                                        variant="filled"
                                        value={collectionId}
                                        onChange={handleChangeCollection}>
                                    <MenuItem key="all" value="all">
                                        {t("select.all")}
                                    </MenuItem>
                                    {collectionQuery.data?.data.map(collection =>
                                        <MenuItem key={collection.id} value={collection.id}>
                                            {collection.name}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Fragment>
                    )}
                </Toolbar>
            </AppBar>
            <div className="map-wrapper">
                {(collectionQuery.isLoading || locationQuery.isLoading) && <AppLoader/>}

                <LocationList collection={collectionChose}
                              locations={locationQuery.data}
                              handleChoseLocation={handleChoseLocation}/>

                <FilterDrawer open={filterMenuOpened} onClose={handleCloseFilterMenu}
                              locationChose={locationChose}
                              onChangeCollection={handleChangeCollection}
                              onChangeLocation={handleChangeLocation}
                              onChangeYear={handleChangeYear}/>

                <MapContainer className="map">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <ChangeView center={center}
                                zoom={zoom}
                                bounds={bounds}/>
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
            {locationChose && (isTabletOrPhone() ? (
                <LocationDetail location={locationChose}/>
            ) : (
                <ItemViewDialog location={locationChose} open={dialogOpened} onClose={handleCloseDialog}/>
            ))}
        </section>
    )
}

type ChangeViewProps = {
    center: LatLngExpression;
    zoom: number;
    bounds?: LatLngBoundsExpression;
}

function ChangeView(props: ChangeViewProps) {
    const map = useMap();

    useEffect(() => {
        if (props.bounds) {
            map.fitBounds(props.bounds);

            // setTimeout(() => {
            //     console.log(map.getZoom())
            //     // map.setZoom(map.getZoom() - 1);
            // }, 400);
        } else {
            map.setView(props.center, props.zoom);
        }
    }, [map, props]);

    return null;
}
