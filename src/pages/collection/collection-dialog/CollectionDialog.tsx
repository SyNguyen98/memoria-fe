import "./CollectionDialog.scss";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
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

    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const onSuccess = () => {
        dispatch(openSnackbar({type: "success", message: t("collection.save_success")}));
        handleClose();
        queryClient.invalidateQueries({ queryKey: ['getAllCollectionsHavingAccess'] })
    }
    const onError = () => {
        dispatch(openSnackbar({type: "error", message: t("collection.save_error")}));
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
        } else {
            setInputs({name: '', description: '', userEmails: []})
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
                {props.collection ? t("collection.edit") : t("collection.add")}
            </DialogTitle>
            <DialogContent>
                {/* Name */}
                <TextField autoComplete="off" required fullWidth
                           name="name" label={t("collection.name")}
                           value={inputs.name}
                           onChange={onInputChange}/>
                {/* Description */}
                <TextField autoComplete="off" fullWidth multiline maxRows={3}
                           name="description" label={t("collection.description")}
                           value={inputs.description}
                           onChange={onInputChange}/>
                <TextField autoComplete="off" fullWidth
                           name="email" label={t("collection.shared_email")}
                           placeholder={t("collection.email_placeholder")}
                           onKeyDown={event => onEnterEmail(event)}/>
                <Typography variant="body1">
                    {t("collection.email_description")}
                </Typography>
                <div className="email-list">
                    {inputs.userEmails.map(email =>
                        <Chip key={email} label={email} variant="outlined" onDelete={() => handleDeleteChip(email)} />
                    )}
                </div>
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
    )
}
