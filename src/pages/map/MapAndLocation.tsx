import "./MapAndLocation.scss";
import {Fragment, useEffect, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {MapContainer, Marker, TileLayer, Tooltip as TooltipMarker, useMap} from 'react-leaflet';
import {latLngBounds} from "leaflet";
import {
    AppBar,
    Card,
    CardContent,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {AccessTime, Menu, Room} from "@mui/icons-material";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {useAppDispatch} from "../../app/hook";
import {openSidebar} from "../../reducers/SidebarReducer";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {useQueryClient} from "@tanstack/react-query";
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

export default function MapAndLocation() {
    const [collectionId, setCollectionId] = useState("");
    const [collectionChose, setCollectionChose] = useState<Collection | null>(null);
    const [locationChose, setLocationChose] = useState<Location | null>(null);
    const [latCenter, setLatCenter] = useState(0);
    const [lngCenter, setLngCenter] = useState(0);
    const [dialogOpened, setDialogOpened] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const collectionQuery = useCollectionQuery();
    const locationQuery = useLocationQuery(collectionId);

    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const markerRefs = useRef({} as never);

    useEffect(() => {
        setLocationChose(null);
    }, [collectionChose]);

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setCollectionId(id);
            const collection = collectionQuery.data?.find(c => c.id === id);
            if (collection) {
                setCollectionChose(collection);
            }
            queryClient.invalidateQueries({queryKey: ['getAllLocationsByCollectionId', id]}).catch(() => {
                dispatch(openSnackbar({type: "error", message: t("location.cannot_load")}));
            });
        } else {
            setSearchParams({id: collectionQuery.data?.[0].id ?? ""});
        }
    }, [collectionQuery.data, dispatch, queryClient, searchParams, setSearchParams, t]);

    useEffect(() => {
        let lat = 0, lng = 0;
        if (locationQuery.data && locationQuery.data.length > 0) {
            locationQuery.data.forEach(location => {
                lat += location.coordinate.latitude;
                lng += location.coordinate.longitude;
            });
            setLatCenter(lat / locationQuery.data.length);
            setLngCenter(lng / locationQuery.data.length);
        }
    }, [latCenter, lngCenter, locationQuery.data]);

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    const handleChangeCollection = (event: SelectChangeEvent) => {
        const collection = collectionQuery.data?.find(c => c.id === event.target.value);
        if (collection) {
            setSearchParams({id: collection.id ?? ""});
            queryClient.invalidateQueries({queryKey: ['getAllLocationsByCollectionId', collection.id]}).catch(() => {
                dispatch(openSnackbar({type: "error", message: t("location.cannot_load")}));
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
        <section id="map-container" className="map-and-location-container">
            {collectionQuery.isLoading ? <AppLoader/> : (
                <Fragment>
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
                                    Bộ sưu tập
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
                        <div className="locations-wrapper">
                            <Typography variant="h6" className="collection-name">
                                {collectionChose?.name}
                            </Typography>
                            <Typography variant="subtitle1" className="collection-description">
                                {collectionChose?.description}
                            </Typography>
                            <Divider/>
                            {locationQuery.data?.map(location => (
                                <Card key={location.id}>
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
                        <MapContainer className="map"
                                      center={[latCenter, lngCenter]}
                                      style={{}}>
                            <ChangeView center={[latCenter, lngCenter]} locations={locationQuery.data ?? []}/>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            {locationQuery.data?.map(location => {
                                const coordinate = location.coordinate;
                                return (
                                    <Marker key={location.id}
                                            position={[coordinate.latitude, coordinate.longitude]}
                                            ref={(ref: never) => {
                                                markerRefs.current[location.id!] = ref
                                            }}
                                            eventHandlers={{click: () => handleOpenDialog(location)}}>
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
                </Fragment>
            )}
        </section>
    )
}

type ChangeViewProps = {
    center: [latCenter: number, lngCenter: number];
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
