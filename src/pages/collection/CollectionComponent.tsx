import './CollectionComponent.scss';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {openSidebar} from "../../reducers/SidebarReducer";
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {
    AppBar,
    Button,
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
import {CollectionApi} from "../../api/CollectionApi";

function CollectionComponent() {
    const [isLoading, setLoading] = useState(false);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [choseCollection, setChoseCollection] = useState<Collection | null>(null);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [dltDialogOpened, setDltDialogOpened] = useState(false);
    const [isRefresh, setRefresh] = useState(false);

    const currentUser = useAppSelector(state => state.user.value);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            setLoading(true);
            CollectionApi.getAllCollectionsHavingAccess().then(res => {
                if (res) {
                    setCollections(res);
                    setLoading(false);
                }
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải bộ sưu tập"}));
                setLoading(false);
            });
        }
    }, [currentUser, dispatch]);

    useEffect(() => {
        if (isRefresh) {
            setLoading(true);
            CollectionApi.getAllCollectionsHavingAccess().then(res => {
                setCollections(res);
                setLoading(false);
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải bộ sưu tập"}));
                setLoading(false);
            });
        }
    }, [dispatch, isRefresh]);

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    const handleNavigateToLocation = (collection: Collection) => {
        sessionStorage.setItem(SessionKey.COLLECTION_ID, collection.id!);
        sessionStorage.setItem(SessionKey.COLLECTION_NAME, collection.name);
        navigate(PathName.LOCATION);
    }

    const handleOpenEditDialog = (collection?: Collection) => {
        setDialogOpened(true);
        setChoseCollection(collection || null);
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
        CollectionApi.deleteCollectionById(choseCollection!.id!).then(() => {
            onDeleteDialogClose();
            dispatch(openSnackbar({type: "success", message: "Đã xóa bộ sưu tập"}));
            setLoading(true);
            setRefresh(true);
        }).catch(() => {
            dispatch(openSnackbar({type: "error", message: "Không thể xóa bộ sưu tập"}));
            setLoading(false);
        });
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
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Bộ Sưu Tập
                    </Typography>
                    <Button className="add-btn" variant="outlined" startIcon={<Add/>}
                            onClick={() => handleOpenEditDialog()}>
                        Thêm
                    </Button>
                </Toolbar>
            </AppBar>
            {/* Collection List */}
            {isLoading ? <AppLoader /> : (
                <Table className="collection-table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">User Email(s)</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {collections.map((collection, index) => (
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
                                    {collection.userEmails.toString()}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(collection)}>
                                        <Edit/>
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(collection)}>
                                        <Delete/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {/* Edit dialog */}
            <CollectionDialog open={dialogOpened} onClose={onEditDialogClose} collection={choseCollection} isSaved={setRefresh}/>
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
