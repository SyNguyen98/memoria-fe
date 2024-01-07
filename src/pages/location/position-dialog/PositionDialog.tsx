import "./PositionDialog.scss";
import {useState} from "react";
import {Button, Dialog, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";
import {PositionDialogProps} from "./PositionDialogProps";
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";

function PositionDialog(props: Readonly<PositionDialogProps>) {
    const [latitude, setLatitude] = useState(10.826567739464473);
    const [longitude, setLongitude] = useState(106.66679907558624);

    const handleSetPosition = (latlng: any) => {
        setLatitude(latlng.lat);
        setLongitude(latlng.lng);
    }

    const handleChoosePosition = () => {
        props.setPosition(latitude, longitude);
        props.onClose();
    }

    return (
        <Dialog className="position-dialog" fullWidth maxWidth="md"
                open={props.open} onClose={props.onClose}>
            <DialogTitle>Chọn vị trí</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <MapContainer className="map-position" zoom={13} center={[latitude, longitude]}>
                            <PickPosition setPosition={handleSetPosition}/>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <Marker position={[latitude, longitude]}/>
                        </MapContainer>
                    </Grid>
                    <Grid item xs={4}>
                        <p className="coordinate">Tọa độ</p>
                        <TextField autoComplete="off" required fullWidth
                                   name="lat" label="Vĩ độ"
                                   value={latitude}/>
                        <TextField autoComplete="off" required fullWidth
                                   name="lng" label="Kinh độ"
                                   value={longitude}/>
                        <Button variant="contained" color="primary" onClick={handleChoosePosition}>
                            Chọn
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

function PickPosition({ setPosition }: any) {
    const map = useMapEvents({
        click: (event: any) => {
            map.locate();
            setPosition(event.latlng);
        }
    })
    return null
}


export default PositionDialog;
