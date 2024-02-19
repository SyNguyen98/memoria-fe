import "./CollectionDialog.scss";
import React, {useEffect, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {useCreateCollectionMutation, useUpdateCollectionMutation} from "../../../custom-query/CollectionQueryHook.ts";
import {Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
// Redux
import {useAppDispatch} from "../../../app/hook";
import {openSnackbar} from "../../../reducers/SnackbarReducer";
// Models
import {Collection} from "../../../models/Collection";

type Props = {
    open: boolean;
    onClose: () => void;
    collection: Collection | null;
}

interface Input {
    name: string;
    description: string;
    userEmails: string[]
}

export default function CollectionDialog(props: Readonly<Props>) {
    const [inputs, setInputs] = useState<Input>({name: '', description: '', userEmails: []});
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const onSuccess = () => {
        dispatch(openSnackbar({type: "success", message: "Lưu thành công"}));
        handleClose();
        queryClient.invalidateQueries({ queryKey: ['getAllCollectionsHavingAccess'] })
    }
    const onError = () => {
        dispatch(openSnackbar({type: "error", message: "Không thể lưu bộ sưu tập"}));
    }
    const createMutation  = useCreateCollectionMutation(onSuccess, onError);
    const updateMutation  = useUpdateCollectionMutation(onSuccess, onError);

    useEffect(() => {
        if (props.collection) {
            setInputs({
                name: props.collection.name,
                description: props.collection.description,
                userEmails: props.collection.userEmails
            });
        }
    }, [props]);

    const onClose = (_event: object, reason: string) => {
        if (reason !== "backdropClick") {
            handleClose();
        }
    }

    const handleClose = () => {
        setInputs({name: '', description: '', userEmails: []});
        props.onClose();
    }

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs(state => ({...state, [event.target.name]: event.target.value}))
    }

    const onEnterEmail = (event: any) => {
        if (event.key === 'Enter') {
            const emails = inputs.userEmails ? [...inputs.userEmails] : [];
            emails.push(event.target.value);
            event.target.value = "";
            setInputs(state => ({...state, userEmails: emails}));
        }
    }

    const handleDeleteChip = (email: string) => {
        const emails = [...inputs.userEmails];
        const index = emails.indexOf(email);
        if (index > -1) {
            emails.splice(index, 1);
            setInputs(state => ({...state, userEmails: emails}));
        }
    }

    const handleSave = () => {
        const collection: Collection = {
            name: inputs.name,
            description: inputs.description,
            userEmails: inputs.userEmails,
        }
        if (props.collection) {
            collection.id = props.collection.id;
            collection.ownerEmail = props.collection.ownerEmail;
            updateMutation.mutate(collection);
        } else {
            createMutation.mutate(collection);
        }
    }

    const handleCancel = () => {
        handleClose();
    }

    return (
        <Dialog className="collection-dialog" maxWidth='md'
                open={props.open} onClose={onClose}>
            <DialogTitle>
                {props.collection ? "Chỉnh Sửa " : "Thêm "} Bộ Sưu Tập
            </DialogTitle>
            <DialogContent>
                {/* Name */}
                <TextField autoComplete="off" required fullWidth
                           name="name" label="Tên"
                           value={inputs.name}
                           onChange={onInputChange}/>
                {/* Description */}
                <TextField autoComplete="off" fullWidth multiline maxRows={3}
                           name="description" label="Mô tả"
                           value={inputs.description}
                           onChange={onInputChange}/>
                <TextField autoComplete="off" fullWidth
                           name="email" label="Email"
                           placeholder="Nhập Email rồi nhấn Enter↵"
                           onKeyDown={event => onEnterEmail(event)}/>
                <Typography variant="body1">
                    Email của người được quyền truy cập
                </Typography>
                <div className="email-list">
                    {inputs.userEmails.map(email =>
                        <Chip key={email} label={email} variant="outlined" onDelete={() => handleDeleteChip(email)} />
                    )}
                </div>
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
