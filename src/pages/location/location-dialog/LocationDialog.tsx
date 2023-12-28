import "./LocationDialog.scss";
import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";
import {DatePicker, LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {vi} from "date-fns/locale";
// Redux
import {useAppDispatch} from "../../../app/hook";
// Models
import {Location} from "../../../models/Location";
import {LocationApi} from "../../../api/LocationApi";
import {openSnackbar} from "../../../reducers/SnackbarReducer";
import {SessionKey} from "../../../constants/Storage";

type Props = {
    open: boolean;
    onClose: () => void;
    location: Location | null;
    isSaved: (saved: boolean) => void;
}

interface Input {
    place: string;
    takenYear: number | null;
    takenMonth: number | null;
    takenDay: number | null;
    takenTime: string;
    latitude: number;
    longitude: number;
}

const initialInput: Input = {
    place: '',
    takenYear: null,
    takenMonth: null,
    takenDay: null,
    takenTime: '',
    latitude: 0,
    longitude: 0,
}

export default function LocationDialog(props: Props) {
    const [inputs, setInputs] = useState<Input>(initialInput);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.location) {
            setInputs({
                place: props.location.place,
                takenYear: props.location.takenYear,
                takenMonth: Number(props.location.takenMonth) - 1,
                takenDay: Number(props.location.takenDay),
                takenTime: props.location.takenTime || '',
                latitude: props.location.coordinate.latitude,
                longitude: props.location.coordinate.longitude,
            });
        }
    }, [props]);

    const onClose = () => {
        setInputs(initialInput);
        props.onClose();
    }

    const onInputPlace = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(state => ({...state, place: event.target.value}))
    }

    const onInputYear = (value: Date | null) => {
        if (value) {
            setInputs(state => ({...state, takenYear: value.getFullYear()}))
        }
    }

    const onInputMonth = (value: Date | null) => {
        if (value) {
            setInputs(state => ({...state, takenMonth: value.getMonth()}))
        }
    }

    const onInputDay = (value: Date | null) => {
        if (value) {
            setInputs(state => ({...state, takenDay: value.getDate()}))
        }
    }

    const onInputTime = (value: Date | null) => {
        if (value) {
            const hour = value.getHours() < 10 ? `0${value.getHours()}` : String(value.getHours());
            const minute = value.getMinutes() < 10 ? `0${value.getMinutes()}` : String(value.getMinutes());
            setInputs(state => ({...state, takenTime: `${hour}:${minute}`}))
        }
    }

    const onInputCoordinate = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'latitude') {
            setInputs(state => ({...state, latitude: Number(event.target.value)}))
        }
        if (event.target.name === 'longitude') {
            setInputs(state => ({...state, longitude: Number(event.target.value)}))
        }
    }

    const getTime = () => {
        if (inputs.takenTime !== '') {
            const hour = inputs.takenTime.split(":").at(0);
            const minute = inputs.takenTime.split(":").at(1);
            return new Date(2000, 0, 1, Number(hour), Number(minute));
        }
        return null;
    }

    const handleSave = () => {
        const location: Location = {
            place: inputs.place,
            takenYear: Number(inputs.takenYear),
            takenMonth: Number(inputs.takenMonth) + 1,
            takenDay: Number(inputs.takenDay),
            takenTime: inputs.takenTime,
            coordinate: {
                latitude: inputs.latitude,
                longitude: inputs.longitude
            },
            collectionId: sessionStorage.getItem(SessionKey.COLLECTION_ID)!
        }
        if (props.location) {
            location.id = props.location.id;
            location.driveItemId = props.location.driveItemId;
            LocationApi.updateLocation(location).then(() => {
                dispatch(openSnackbar({type: "success", message: "Lưu thành công"}));
                props.isSaved(true);
                onClose();
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể lưu địa điểm"}));
            })
        } else {
            LocationApi.createLocation(location).then(() => {
                dispatch(openSnackbar({type: "success", message: "Lưu thành công"}));
                props.isSaved(true);
                onClose();
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể lưu địa điểm"}));
            })
        }
    }

    const handleCancel = () => {
        props.isSaved(false);
        onClose();
    }

    return (
        <Dialog className="collection-dialog" maxWidth='md'
                open={props.open} onClose={onClose}>
            <DialogTitle>
                {props.location ? "Chỉnh Sửa " : "Thêm "} Địa Điểm
            </DialogTitle>
            <DialogContent>
                {/* Place */}
                <TextField autoComplete="off" required fullWidth
                           name="place" label="Địa Điểm"
                           value={inputs.place}
                           onChange={onInputPlace}/>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        {/* Year */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker label="Năm" openTo="year" views={['year']}
                                        value={inputs.takenYear ? new Date(inputs.takenYear, 1) : null}
                                        onYearChange={onInputYear}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3}>
                        {/* Month */}
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                            <DatePicker label="Tháng" openTo="month" views={['month']}
                                        disabled={inputs.takenYear === null}
                                        value={inputs.takenMonth ? new Date(inputs.takenYear!, inputs.takenMonth) : null}
                                        onMonthChange={onInputMonth}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3}>
                        {/* Day */}
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                            <DatePicker label="Ngày" openTo="day" views={['day']}
                                        disabled={inputs.takenYear === null && inputs.takenMonth === null}
                                        value={inputs.takenDay ? new Date(inputs.takenYear!, inputs.takenMonth!, inputs.takenDay) : null}
                                        onChange={onInputDay}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3}>
                        {/* Time */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker label="Thời Gian" ampm={false}
                                        disabled={inputs.takenYear === null && inputs.takenMonth === null && inputs.takenDay === null}
                                        value={getTime()} onChange={onInputTime}/>
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                {/* Coordinate */}
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        {/* Latitude */}
                        <TextField autoComplete="off" required fullWidth
                                   name="latitude" label="Vĩ Độ"
                                   value={inputs.latitude}
                                   onChange={onInputCoordinate}/>
                    </Grid>
                    <Grid item xs={6}>
                        {/* Longitude */}
                        <TextField autoComplete="off" required fullWidth
                                   name="longitude" label="Kinh Độ"
                                   value={inputs.longitude}
                                   onChange={onInputCoordinate}/>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Lưu
                </Button>
                <Button variant="contained" color="inherit" onClick={handleCancel}>
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    )
}
