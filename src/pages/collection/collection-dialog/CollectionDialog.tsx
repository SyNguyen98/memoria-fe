import "./CollectionDialog.scss";
import React, {Fragment, useEffect, useState} from "react";
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField
} from "@mui/material";
import {FileUpload, MyLocation} from "@mui/icons-material";
// Redux
import {useAppDispatch} from "../../../app/hook";
// Models
import {Collection} from "../../../models/Collection";
import PositionDialog from "../position-dialog/PositionDialog";
import {CollectionApi} from "../../../api/CollectionApi";
import {openSnackbar} from "../../../reducers/SnackbarReducer";

type Props = {
    open: boolean;
    onClose: () => void;
    collection: Collection | null;
    isSaved: (saved: boolean) => void;
}

interface Input {
    name: string;
    description: string;
    userEmails: string[]
}

export default function CollectionDialog(props: Props) {
    const [inputs, setInputs] = useState<Input>({name: '', description: '', userEmails: []});

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.collection) {
            setInputs({
                name: props.collection.name,
                description: props.collection.description,
                userEmails: props.collection.userEmails
            });
        }
    }, [props]);

    const onClose = () => {
        setInputs({name: '', description: '', userEmails: []});
        props.onClose();
    }

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs(state => ({...state, [event.target.name]: event.target.value}))
    }

    const onEnterEmail = (event: any) => {
        if (event.key === 'Enter') {
            let emails = inputs.userEmails ? [...inputs.userEmails] : [];
            emails.push(event.target.value);
            event.target.value = "";
            setInputs(state => ({...state, userEmails: emails}));
        }
    }

    const handleDeleteChip = (email: string) => {
        let emails = [...inputs.userEmails];
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
            CollectionApi.updateCollection(collection).then(() => {
                dispatch(openSnackbar({type: "success", message: "Lưu thành công"}));
                props.isSaved(true);
                onClose();
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể lưu bộ sưu tập"}));
            })
        } else {
            CollectionApi.createCollection(collection).then(() => {
                dispatch(openSnackbar({type: "success", message: "Lưu thành công"}));
                props.isSaved(true);
                onClose();
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể lưu bộ sưu tập"}));
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
                           placeholder="Email của người được quyền truy cập"
                           onKeyDown={event => onEnterEmail(event)}/>
                <div className="email-list">
                    {inputs.userEmails && inputs.userEmails.map((email, index) =>
                        <Chip key={index} label={email} variant="outlined" onDelete={() => handleDeleteChip(email)} />
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
