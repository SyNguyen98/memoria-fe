import {Alert, Snackbar} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hook.ts";
import {closeSnackbar} from "../../reducers/SnackbarReducer.ts";

export default function AppSnackbar() {
    const snackbar = useAppSelector(state => state.snackbar.value);
    const dispatch = useAppDispatch();

    return (
        <Snackbar open={snackbar.open} autoHideDuration={3000}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                  onClose={() => dispatch(closeSnackbar())}>
            <Alert severity={snackbar.type}>{snackbar.message}</Alert>
        </Snackbar>
    )
}