import "./LocationDialog.scss";
import React, {Fragment, useEffect, useState} from "react";
import {useSearchParams} from "react-router";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "@tanstack/react-query";
import {useCreateLocationMutation, useUpdateLocationMutation} from "../../../custom-query/LocationQueryHook.ts";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid2,
    IconButton,
    MenuItem,
    TextField
} from "@mui/material";
import {MyLocation} from "@mui/icons-material";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {useAppDispatch} from "../../../app/hook";
import {Location} from "../../../models/Location";
import {openSnackbar} from "../../../reducers/SnackbarReducer";
import {isTabletOrPhone} from "../../../utils/ScreenUtil.ts";
import {isLeapYear} from "../../../utils/DateUtil.ts";
import PositionDialog from "../position-dialog/PositionDialog.tsx";

type Props = {
    open: boolean;
    onClose: () => void;
    location: Location | null;
}

interface Input {
    place: string;
    description: string;
    takenYear: number | null;
    takenMonth: number | null;
    takenDay: number | null;
    takenTime: string;
    latitude: number;
    longitude: number;
}

const initialInput: Input = {
    place: '',
    description: '',
    takenYear: null,
    takenMonth: null,
    takenDay: null,
    takenTime: '',
    latitude: 0,
    longitude: 0,
}

const CURRENT_YEAR = new Date().getFullYear();
const MONTHS: number[] = Array.from({length: 12}, (_, i) => i + 1);
const YEARS: number[] = Array.from({length: CURRENT_YEAR - 2000 + 1}, (_, i) => CURRENT_YEAR - i);

export default function LocationDialog(props: Readonly<Props>) {
    const [collectionId, setCollectionId] = useState('');
    const [inputs, setInputs] = useState<Input>(initialInput);
    const [posDialogOpen, setPosDialogOpen] = useState(false);

    const [searchParams] = useSearchParams();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const onSuccess = () => {
        const collectionId = searchParams.get("id");
        dispatch(openSnackbar({type: "success", message: t('location.save_success')}));
        handleClose();
        queryClient.invalidateQueries({queryKey: ['getPagingLocationsByParams', collectionId]})
    }
    const onError = () => {
        dispatch(openSnackbar({type: "error", message: t('location.save_error')}));
    }
    const createMutation = useCreateLocationMutation(onSuccess, onError);
    const updateMutation = useUpdateLocationMutation(onSuccess, onError);

    useEffect(() => {
        if (props.location) {
            setInputs({
                place: props.location.place,
                description: props.location.description,
                takenYear: props.location.takenYear,
                takenMonth: Number(props.location.takenMonth),
                takenDay: Number(props.location.takenDay),
                takenTime: props.location.takenTime ?? '',
                latitude: props.location.coordinate.latitude,
                longitude: props.location.coordinate.longitude,
            });
        }
        const collectionId = searchParams.get("id");
        if (collectionId) {
            setCollectionId(collectionId);
        }
    }, [props, searchParams]);

    const onClose = (_event: object, reason: string) => {
        if (reason !== "backdropClick") {
            handleClose();
        }
    }

    const handleClose = () => {
        setInputs(initialInput);
        props.onClose();
    }

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs(state => ({...state, [event.target.name]: event.target.value}));
    }

    const onInputTime = (value: Date | null) => {
        setInputs(state => ({
            ...state,
            takenTime: value
                ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
                : ''
        }));
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
        return inputs.takenTime !== ''
            ? new Date(2000, 0, 1, ...inputs.takenTime.split(":").map(Number))
            : null;
    }

    const handleOpenPositionDialog = () => {
        setPosDialogOpen(true);
    }

    const handleClosePositionDialog = () => {
        setPosDialogOpen(false);
    }

    const handleSetPosition = (lat: number, lng: number) => {
        setInputs(state => ({...state, latitude: lat, longitude: lng}));
    }

    const handleSave = () => {
        const location: Location = {
            place: inputs.place,
            description: inputs.description,
            takenYear: Number(inputs.takenYear),
            takenMonth: Number(inputs.takenMonth),
            takenDay: Number(inputs.takenDay),
            takenTime: inputs.takenTime,
            coordinate: {
                latitude: inputs.latitude,
                longitude: inputs.longitude
            },
            collectionId: collectionId
        }
        if (props.location) {
            location.id = props.location.id;
            updateMutation.mutate(location);
        } else {
            createMutation.mutate(location);
        }
    }

    const handleCancel = () => {
        handleClose();
    }

    return (
        <Fragment>
            <Dialog className="location-dialog" maxWidth={isTabletOrPhone() ? "xs" : "lg"}
                    open={props.open} onClose={onClose}>
                <DialogTitle>
                    {props.location ? t("location.edit") : t("location.add")}
                </DialogTitle>
                <DialogContent>
                    {/* Place */}
                    <TextField autoComplete="off" required fullWidth
                               name="place"
                               label={t("location.0")}
                               value={inputs.place}
                               onChange={onInputChange}/>
                    {/* Description */}
                    <TextField autoComplete="off" fullWidth multiline maxRows={3}
                               name="description"
                               label={t("location.description")}
                               value={inputs.description}
                               onChange={onInputChange}/>
                    <Grid2 container spacing={1}>
                        <Grid2 size={{ xs: 6, md: 3 }}>
                            {/* Year */}
                            <TextField select fullWidth
                                       name="takenYear"
                                       label={t("location.year")}
                                       value={inputs.takenYear}
                                       onChange={onInputChange}>
                                {YEARS.map(year => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid2>
                        <Grid2 size={{xs: 6, md: 3}}>
                            {/* Month */}
                            <TextField select fullWidth
                                       name="takenMonth"
                                       label={t("location.month")}
                                       disabled={inputs.takenYear === null}
                                       value={inputs.takenMonth}
                                       onChange={onInputChange}>
                                {MONTHS.map(month => (
                                    <MenuItem key={month} value={month}>
                                        {month}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid2>
                        <Grid2 size={{ xs: 6, md: 3 }}>
                            {/* Day */}
                            <TextField select fullWidth
                                       name="takenDay"
                                       label={t("location.day")}
                                       disabled={inputs.takenYear === null && inputs.takenMonth === null}
                                       value={inputs.takenDay}
                                       onChange={onInputChange}>
                                {(() => {
                                    const daysInMonth = inputs.takenMonth === 2
                                        ? isLeapYear(inputs.takenYear!) ? 29 : 28
                                        : [4, 6, 9, 11].includes(inputs.takenMonth!) ? 30 : 31;
                                    return Array.from({length: daysInMonth}, (_, i) => i + 1).map(day => (
                                        <MenuItem key={day} value={day}>
                                            {day}
                                        </MenuItem>
                                    ));
                                })()}
                            </TextField>
                        </Grid2>
                        <Grid2 size={{ xs: 6, md: 3 }}>
                            {/* Time */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker className="time-input"
                                            label={t("location.time")}
                                            ampm={false}
                                            disabled={inputs.takenYear === null && inputs.takenMonth === null && inputs.takenDay === null}
                                            value={getTime()} onChange={onInputTime}/>
                            </LocalizationProvider>
                        </Grid2>
                    </Grid2>
                    {/* Coordinate */}
                    <Grid2 container spacing={1}>
                        <Grid2 size={{ xs: 12, md: 5.5 }}>
                            {/* Latitude */}
                            <TextField autoComplete="off" required fullWidth
                                       name="latitude"
                                       label={t("location.latitude")}
                                       value={inputs.latitude}
                                       onChange={onInputCoordinate}/>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 5.5 }}>
                            {/* Longitude */}
                            <TextField autoComplete="off" required fullWidth
                                       name="longitude"
                                       label={t("location.longitude")}
                                       value={inputs.longitude}
                                       onChange={onInputCoordinate}/>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 1 }} className="coor-btn">
                            <IconButton onClick={handleOpenPositionDialog}>
                                <MyLocation />
                            </IconButton>
                        </Grid2>
                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        {t("button.save")}
                    </Button>
                    <Button variant="contained" color="inherit" onClick={handleCancel}>
                        {t("button.cancel")}
                    </Button>
                </DialogActions>
            </Dialog>

            <PositionDialog open={posDialogOpen}
                            onClose={handleClosePositionDialog}
                            position={{lat: inputs.latitude, lng: inputs.longitude}}
                            setPosition={handleSetPosition} />
        </Fragment>
    )
}
