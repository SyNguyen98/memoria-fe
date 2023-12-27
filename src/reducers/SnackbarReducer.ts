import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface ISnackbar {
    open?: boolean;
    type: 'success' | 'warning' | 'error';
    message: string
}

interface SnackbarState {
    value: ISnackbar
}

const initialState: SnackbarState = {
    value: {open: false, type: 'success', message: ''}
}

export const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        openSnackbar: (state, action: PayloadAction<ISnackbar>) => {
            action.payload.open = true;
            state.value = action.payload;
        },
        closeSnackbar: state => {
            state.value = {open: false, type: 'success', message: ''}
        }
    }
});

export const {openSnackbar, closeSnackbar} = snackbarSlice.actions;

export default snackbarSlice.reducer;
