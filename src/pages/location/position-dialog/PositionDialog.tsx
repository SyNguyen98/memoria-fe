import "./PositionDialog.scss";
import {useState} from "react";
import {Button, Dialog, DialogContent, DialogTitle, Grid2 as Grid, TextField} from "@mui/material";
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import {LatLng, LeafletMouseEvent} from "leaflet";
import {isTabletOrPhone} from "../../../utils/ScreenUtil.ts";
import {useTranslation} from "react-i18next";

type PositionDialogProps = {
    open: boolean;
    onClose: () => void;
    setPosition: (lat: number, lng: number) => void;
}

function PositionDialog(props: Readonly<PositionDialogProps>) {
    const [latitude, setLatitude] = useState(10.826567739464473);
    const [longitude, setLongitude] = useState(106.66679907558624);
    const [displayLng, setDisplayLng] = useState(106.66679907558624);

    const {t} = useTranslation();

    const onClose = (_event: object, reason: string) => {
        if (reason !== "backdropClick") {
            props.onClose();
        }
    }

    const handleSetPosition = (latlng: LatLng) => {
        setLatitude(latlng.lat);
        setLongitude(latlng.lng);
        if (latlng.lng < -180) {
            let newLongitude =  latlng.lng;
            while (newLongitude < -180) {
                newLongitude += 360;
            }
            setDisplayLng(newLongitude);
        } else if (latlng.lng > 180) {
            let newLongitude =  latlng.lng;
            while (newLongitude > 180) {
                newLongitude -= 360;
            }
            setDisplayLng(newLongitude);
        } else {
            setDisplayLng(latlng.lng);
        }
    }

    const handleChoosePosition = () => {
        props.setPosition(latitude, displayLng);
        handleClose();
    }

    const handleClose = () => {
        setLatitude(10.826567739464473);
        setLongitude(106.66679907558624);
        setDisplayLng(106.66679907558624);
        props.onClose();
    }

    return (
        <Dialog className="position-dialog" fullWidth
                maxWidth={isTabletOrPhone() ? "xs" : "md"}
                open={props.open}
                onClose={onClose}>
            <DialogTitle>
                {t("position.choose")}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <MapContainer className="map-position" zoom={13} center={[latitude, longitude]}>
                            <PickPosition setPosition={handleSetPosition}/>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Marker position={[latitude, longitude]}/>
                        </MapContainer>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <p className="coordinate">
                            {t("position.coordinate")}
                        </p>
                        <TextField autoComplete="off" required fullWidth
                                   name="lat"
                                   label={t("position.latitude")}
                                   value={latitude}/>
                        <TextField autoComplete="off" required fullWidth
                                   name="lng"
                                   label={t("position.longitude")}
                                   value={displayLng}/>
                        <Button variant="contained" color="primary"
                                onClick={handleChoosePosition}>
                            {t("position.btn-choose")}
                        </Button>
                        <Button variant="contained" color="inherit"
                                onClick={handleClose}>
                            {t("position.btn-close")}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

function PickPosition({setPosition}: {setPosition: (latlng: LatLng) => void}) {
    const map = useMapEvents({
        click: (event: LeafletMouseEvent) => {
            map.locate();
            setPosition(event.latlng);
        }
    })
    return null
}

export default PositionDialog;
