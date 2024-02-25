import "./DeleteCollectionDialog.scss";
import {useTranslation} from "react-i18next";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useQueryClient} from "@tanstack/react-query";
import {useDeleteCollectionMutation} from "../../../custom-query/CollectionQueryHook.ts";
import {openSnackbar} from "../../../reducers/SnackbarReducer.ts";
import {useAppDispatch} from "../../../app/hook.ts";
import {Collection} from "../../../models/Collection.ts";

type Props = {
    open: boolean;
    onClose: () => void;
    collection: Collection;
}

function DeleteCollectionDialog(props: Props) {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const onSuccess = () => {
        props.onClose();
        dispatch(openSnackbar({type: "success", message: t("collection.delete_success")}));
        queryClient.invalidateQueries({ queryKey: ['getAllCollectionsHavingAccess'] })
    }
    const onError = () => {
        dispatch(openSnackbar({type: "error", message: t("collection.delete_error")}));
    }

    const deleteMutation  = useDeleteCollectionMutation(onSuccess, onError);

    const handleDeleteCollection = () => {
        deleteMutation.mutate(props.collection.id!);
    }

    return (
        <Dialog id="delete-collection-dialog" open={props.open} onClose={props.onClose}>
            <DialogTitle>
                {t("collection.delete")}
            </DialogTitle>
            <DialogContent>
                {t("collection.confirm_delete")} <b><i>{props.collection.name}</i></b>?
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
    );
}

export default DeleteCollectionDialog;