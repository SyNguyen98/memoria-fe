import "./DeleteLocationDialog.scss";
import {useSearchParams} from "react-router";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useQueryClient} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";
import {Location} from "../../../models/Location.ts";
import {useDeleteLocationMutation} from "../../../custom-query/LocationQueryHook.ts";
import {openSnackbar} from "../../../reducers/SnackbarReducer.ts";
import {useAppDispatch} from "../../../app/hook.ts";

type Props = {
    open: boolean;
    onClose: () => void;
    location: Location | null;
}

function DeleteLocationDialog(props: Props) {
    const {t} = useTranslation();
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const deleteMutation = useDeleteLocationMutation();

    const handleDeleteCollection = () => {
        deleteMutation.mutate(props.location!.id!, {
            onSuccess: () => {
                const collectionId = searchParams.get("id");
                props.onClose();
                dispatch(openSnackbar({type: "success", message: "Đã xóa địa điểm"}));
                queryClient.invalidateQueries({queryKey: ['getPagingLocationsByParams', collectionId]}).catch(() => {
                    dispatch(openSnackbar({type: "error", message: "Không thể tải địa điểm"}));
                });
            },
            onError: () => {
                dispatch(openSnackbar({type: "error", message: "Không thể xóa địa điểm"}));
            }
        });
    }

    return (
        props.location && (
            <Dialog className="delete-location-dialog"
                    open={props.open}
                    onClose={props.onClose}>
                <DialogTitle>
                    {t('location.delete')}
                </DialogTitle>
                <DialogContent>
                    {t('location.confirm_delete')}<b><i>{props.location.place}</i></b>?
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleDeleteCollection}>
                        {t("button.delete")}
                    </Button>
                    <Button variant="contained" color="inherit" onClick={props.onClose}>
                        {t("button.cancel")}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    );
}

export default DeleteLocationDialog;