import './CollectionComponent.scss';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {openSidebar} from "../../reducers/SidebarReducer";
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {
    AppBar,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@mui/material";
import {Add, Delete, Edit, Menu} from "@mui/icons-material";
// Components
import AppLoader from "../../components/AppLoader";
import CollectionDialog from "./collection-dialog/CollectionDialog";
// Models & Constants
import {Collection} from "../../models/Collection";
import {SessionKey} from "../../constants/Storage";
import {PathName} from "../../constants/Page";
// Utils & Services
import {useCollectionQuery, useDeleteCollectionMutation} from "../../custom-query/CollectionQueryHook.ts";

function CollectionComponent() {
    const [choseCollection, setChoseCollection] = useState<Collection | null>(null);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [dltDialogOpened, setDltDialogOpened] = useState(false);

    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const onSuccess = () => {
        onDeleteDialogClose();
        dispatch(openSnackbar({type: "success", message: "Đã xóa bộ sưu tập"}));
        queryClient.invalidateQueries({ queryKey: ['getAllCollectionsHavingAccess'] })
    }
    const onError = () => {
        dispatch(openSnackbar({type: "error", message: "Không thể xóa bộ sưu tập"}));
    }

    const collectionQuery = useCollectionQuery();

    const deleteMutation  = useDeleteCollectionMutation(onSuccess, onError);

    const currentUser = useAppSelector(state => state.user.value);
    const navigate = useNavigate();

    useEffect(() => {
        if (collectionQuery.isError) {
            dispatch(openSnackbar({type: "error", message: "Không thể tải bộ sưu tập"}));
        }
    }, [collectionQuery.isError, dispatch]);

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    const isCollectionOwner = (collection: Collection) => {
        if (currentUser && collection.ownerEmail) {
            return currentUser.email === collection.ownerEmail;
        }
        return false;
    }

    const handleNavigateToLocation = (collection: Collection) => {
        sessionStorage.setItem(SessionKey.COLLECTION_ID, collection.id!);
        sessionStorage.setItem(SessionKey.COLLECTION_NAME, collection.name);
        sessionStorage.setItem(SessionKey.COLLECTION_OWNER_EMAIL, collection.ownerEmail ?? '');
        navigate(PathName.LOCATION);
    }

    const handleOpenEditDialog = (collection?: Collection) => {
        setDialogOpened(true);
        setChoseCollection(collection ?? null);
    }

    const onEditDialogClose = () => {
        setDialogOpened(false);
        setChoseCollection(null)
    }

    const handleOpenDeleteDialog = (collection: Collection) => {
        setDltDialogOpened(true);
        setChoseCollection(collection);
    }

    const onDeleteDialogClose = () => {
        setDltDialogOpened(false);
        setChoseCollection(null);
    }

    const handleDeleteCollection = () => {
        deleteMutation.mutate(choseCollection!.id!);
    }

    return (
        <section className="collection-container">
            {/* App Bar */}
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit"
                                aria-label="menu" sx={{mr: 2}}
                                onClick={handleOpenMenu}>
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        Bộ Sưu Tập
                    </Typography>
                    <Button className="add-btn" variant="outlined" startIcon={<Add/>}
                            onClick={() => handleOpenEditDialog()}>
                        Thêm
                    </Button>
                </Toolbar>
            </AppBar>
            {/* Collection List */}
            {collectionQuery.isLoading ? <AppLoader /> : (
                <Table className="collection-table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Mô Tả</TableCell>
                            <TableCell>Email Chia Sẻ</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {collectionQuery.data?.map((collection, index) => (
                            <TableRow key={collection.id}>
                                <TableCell align="center">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" className="collection-name"
                                                onClick={() => handleNavigateToLocation(collection)}>
                                        {collection.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {collection.description}
                                </TableCell>
                                <TableCell>
                                    {collection.userEmails.map(email =>
                                        <Chip key={email} variant="outlined" label={email} />
                                    )}
                                </TableCell>
                                {isCollectionOwner(collection) ? (
                                    <TableCell align="center" width={80}>
                                        <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(collection)}>
                                            <Edit/>
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(collection)}>
                                            <Delete/>
                                        </IconButton>
                                    </TableCell>
                                ) : <TableCell/>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {/* Edit dialog */}
            <CollectionDialog open={dialogOpened} onClose={onEditDialogClose} collection={choseCollection}/>
            {/* Delete dialog */}
            {choseCollection && (
                <Dialog id="delete-collection-dialog" open={dltDialogOpened} onClose={onDeleteDialogClose}>
                    <DialogTitle>Xóa bộ sưu tập</DialogTitle>
                    <DialogContent>
                        Bạn có chắc là muốn xóa bộ sưu tập <b><i>{choseCollection.name}</i></b>?
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleDeleteCollection}>
                            Xóa
                        </Button>
                        <Button variant="contained" color="inherit" onClick={onDeleteDialogClose}>
                            Hủy
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </section>
    )
}

export default CollectionComponent;
