import "./LocationDialog.scss";
import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "@tanstack/react-query";
import {useCreateLocationMutation, useUpdateLocationMutation} from "../../../custom-query/LocationQueryHook.ts";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField} from "@mui/material";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
// Redux
import {useAppDispatch} from "../../../app/hook";
import {Location} from "../../../models/Location";
import {openSnackbar} from "../../../reducers/SnackbarReducer";

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

export default function LocationDialog(props: Readonly<Props>) {
    const [collectionId, setCollectionId] = useState('');
    const [inputs, setInputs] = useState<Input>(initialInput);
    const [years, setYears] = useState<number[]>([]);

    const [searchParams] = useSearchParams();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const onSuccess = () => {
        dispatch(openSnackbar({type: "success", message: t('location.save_success')}));
        handleClose();
        queryClient.invalidateQueries({queryKey: ['getAllLocationsByCollectionId']})
    }
    const onError = () => {
        dispatch(openSnackbar({type: "error", message: t('location.save_error')}));
    }
    const createMutation = useCreateLocationMutation(onSuccess, onError);
    const updateMutation = useUpdateLocationMutation(onSuccess, onError);

    const MONTHS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const DAYS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

    useEffect(() => {
        const _years = []
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1990; i--) {
            _years.push(i);
        }
        setYears(_years);
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
        const collectionId = searchParams.get("collectionId");
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
            location.driveItemId = props.location.driveItemId;
            updateMutation.mutate(location);
        } else {
            createMutation.mutate(location);
        }
    }

    const handleCancel = () => {
        handleClose();
    }

    return (
        <Dialog className="collection-dialog" maxWidth='lg'
                open={props.open} onClose={onClose}>
            <DialogTitle>
                {props.location ? "Chỉnh Sửa " : "Thêm "} Địa Điểm
            </DialogTitle>
            <DialogContent>
                {/* Place */}
                <TextField autoComplete="off" required fullWidth
                           name="place" label="Địa Điểm"
                           value={inputs.place}
                           onChange={onInputChange}/>
                {/* Description */}
                <TextField autoComplete="off" fullWidth multiline maxRows={3}
                           name="description" label="Mô tả"
                           value={inputs.description}
                           onChange={onInputChange}/>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        {/* Year */}
                        <TextField select fullWidth
                                   name="takenYear" label="Năm"
                                   value={inputs.takenYear}
                                   onChange={onInputChange}>
                            {years.map(year => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        {/* Month */}
                        <TextField select fullWidth
                                   name="takenMonth" label="Tháng"
                                   disabled={inputs.takenYear === null}
                                   value={inputs.takenMonth}
                                   onChange={onInputChange}>
                            {MONTHS.map(month => (
                                <MenuItem key={month} value={month}>
                                    {month}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        {/* Day */}
                        <TextField select fullWidth
                                   name="takenDay" label="Ngày"
                                   disabled={inputs.takenYear === null && inputs.takenMonth === null}
                                   value={inputs.takenDay}
                                   onChange={onInputChange}>
                            {DAYS.map(day => (
                                <MenuItem key={day} value={day}>
                                    {day}
                                </MenuItem>
                            ))}
                        </TextField>
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
