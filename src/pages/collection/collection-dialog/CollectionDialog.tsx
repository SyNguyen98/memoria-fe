import "./CollectionDialog.scss";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "@tanstack/react-query";
import {useCreateCollectionMutation, useUpdateCollectionMutation} from "../../../custom-query/CollectionQueryHook.ts";
import {
    Autocomplete,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
// Redux
import {useAppDispatch} from "../../../app/hook";
import {openSnackbar} from "../../../reducers/SnackbarReducer";
// Models
import {Collection} from "../../../models/Collection";
import {isTabletOrPhone} from "../../../utils/ScreenUtil.ts";

type Props = {
    open: boolean;
    onClose: () => void;
    collection: Collection | null;
}

type Input = {
    name: string;
    description: string;
    userEmails: string[];
}

type TagOption = {
    label: string;
    value: string;
}

export default function CollectionDialog(props: Readonly<Props>) {
    const [inputs, setInputs] = useState<Input>({name: '', description: '', userEmails: []});
    const [tags, setTags] = useState<string[]>([]);

    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const onSuccess = () => {
        dispatch(openSnackbar({type: "success", message: t("collection.save_success")}));
        handleClose();
        queryClient.invalidateQueries({queryKey: ['getAllCollectionsHavingAccess']})
    }
    const onError = () => {
        dispatch(openSnackbar({type: "error", message: t("collection.save_error")}));
    }
    const createMutation = useCreateCollectionMutation(onSuccess, onError);
    const updateMutation = useUpdateCollectionMutation(onSuccess, onError);

    const TAG_OPTIONS: TagOption[] = [
        {
            label: t("tags.family"),
            value: "FAMILY"
        },
        {
            label: t("tags.friends"),
            value: "FRIENDS"
        },
        {
            label: t("tags.colleagues"),
            value: "COLLEAGUES"
        },
        {
            label: t("tags.lover"),
            value: "LOVER"
        }
    ]

    useEffect(() => {
        if (props.collection) {
            setInputs({
                name: props.collection.name,
                description: props.collection.description,
                userEmails: props.collection.userEmails
            });
            setTags(props.collection.tags || []);
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

    const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs(state => ({...state, [event.target.name]: event.target.value}))
    }

    const handleOnChangeTags = (value: TagOption[]) => {
        setTags(value.map(option => option.value));
    };

    const onEnterEmail = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            const target = event.target as HTMLInputElement;
            const emails = inputs.userEmails ? [...inputs.userEmails] : [];
            emails.push(target.value);
            target.value = "";
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
            tags,
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
        <Dialog className="collection-dialog" maxWidth={isTabletOrPhone() ? "xs" : "md"}
                open={props.open} onClose={onClose}>
            <DialogTitle>
                {props.collection ? t("collection.edit") : t("collection.add")}
            </DialogTitle>
            <DialogContent>
                {/* Name */}
                <TextField autoComplete="off" required fullWidth
                           name="name" label={t("collection.name")}
                           value={inputs.name}
                           onChange={handleOnInputChange}/>
                {/* Description */}
                <TextField autoComplete="off" fullWidth multiline maxRows={3}
                           name="description" label={t("collection.description")}
                           value={inputs.description}
                           onChange={handleOnInputChange}/>
                {/* Tags */}
                <Autocomplete multiple
                              options={TAG_OPTIONS.filter(option => !tags.includes(option.value))}
                              getOptionLabel={option => option.label}
                              value={TAG_OPTIONS.filter(option => tags.includes(option.value))}
                              onChange={(_event, value) => handleOnChangeTags(value)}
                              renderInput={(params) => (
                                  <TextField {...params} label={t("collection.tags")}/>
                              )}
                />
                {/* Emails */}
                <TextField autoComplete="off" fullWidth
                           name="email" label={t("collection.shared_email")}
                           placeholder={t("collection.email_placeholder")}
                           onKeyDown={event => onEnterEmail(event)}/>
                <Typography variant="body1">
                    {t("collection.email_description")}
                </Typography>
                <div className="email-list">
                    {inputs.userEmails.map(email =>
                        <Chip key={email} label={email} variant="outlined" onDelete={() => handleDeleteChip(email)}/>
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
