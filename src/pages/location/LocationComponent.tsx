import './LocationComponent.scss';
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
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
import {Add, Delete, Edit, KeyboardArrowRight, Menu} from "@mui/icons-material";
// Components
import AppLoader from "../../components/AppLoader";
import LocationDialog from "./location-dialog/LocationDialog";
// Models & Constants
import {Location} from "../../models/Location";
import {SessionKey} from "../../constants/Storage";
import {PathName} from "../../constants/Page";
// Utils & Services
import {LocationApi} from "../../api/LocationApi";
import {DateUtil} from "../../utils/DateUtil";

function LocationComponent() {
    const [isLoading, setLoading] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [choseLocation, setChoseLocation] = useState<Location | null>(null);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [dltDialogOpened, setDltDialogOpened] = useState(false);
    const [isRefresh, setRefresh] = useState(false);

    const currentUser = useAppSelector(state => state.user.value);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const collectionId = sessionStorage.getItem(SessionKey.COLLECTION_ID);
        if (currentUser && collectionId) {
            setLoading(true);
            setCollectionName(sessionStorage.getItem(SessionKey.COLLECTION_NAME) || '');
            LocationApi.getAllLocationsByCollectionId(collectionId).then(res => {
                setLocations(res);
                setLoading(false);
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải các địa điểm"}));
                setLoading(false);
            });
        }
    }, [currentUser, dispatch]);

    useEffect(() => {
        const collectionId = sessionStorage.getItem(SessionKey.COLLECTION_ID);
        if (collectionId && isRefresh) {
            setLoading(true);
            LocationApi.getAllLocationsByCollectionId(collectionId).then(res => {
                setLocations(res);
                setLoading(false);
            }).catch(() => {
                dispatch(openSnackbar({type: "error", message: "Không thể tải các địa điểm"}));
                setLoading(false);
            });
        }
    }, [dispatch, isRefresh]);

    const handleOpenMenu = () => {
        dispatch(openSidebar())
    }

    const handleNavigateToItem = (location: Location) => {
        sessionStorage.setItem(SessionKey.LOCATION_PLACE, location.place);
        sessionStorage.setItem(SessionKey.DRIVE_ITEM_ID, location.driveItemId!);
        navigate(PathName.ITEM);
    }

    const handleOpenEditDialog = (location?: Location) => {
        setDialogOpened(true);
        setChoseLocation(location || null);
    }

    const onEditDialogClose = () => {
        setDialogOpened(false);
        setChoseLocation(null)
    }

    const handleOpenDeleteDialog = (location: Location) => {
        setDltDialogOpened(true);
        setChoseLocation(location);
    }

    const onDeleteDialogClose = () => {
        setDltDialogOpened(false);
        setChoseLocation(null);
    }

    const handleDeleteCollection = () => {
        setLoading(true);
        LocationApi.deleteLocationById(choseLocation!.id!).then(() => {
            onDeleteDialogClose();
            dispatch(openSnackbar({type: "success", message: "Đã xóa bộ sưu tập"}));
            setLoading(false);
            setRefresh(true);
        }).catch(() => {
            dispatch(openSnackbar({type: "error", message: "Không thể xóa bộ sưu tập"}));
            setLoading(false);
        });
    }

    return (
        <section className="location-container">
            {/* App Bar */}
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" onClick={handleOpenMenu}>
                        <Menu/>
                    </IconButton>
                    <Typography className="page-title" variant="h6" component="div" sx={{flexGrow: 1}}>
                        <Link className="collection-title" to="/collection">
                            Bộ Sưu Tập
                        </Link>
                        <KeyboardArrowRight />
                        {collectionName}
                    </Typography>
                    <Button className="add-btn" variant="outlined" startIcon={<Add/>}
                            onClick={() => handleOpenEditDialog()}>
                        Thêm
                    </Button>
                </Toolbar>
            </AppBar>
            {/* Collection List */}
            {isLoading ? <AppLoader /> : (
                <Table className="location-table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell>Địa Điểm</TableCell>
                            <TableCell>Mô Tả</TableCell>
                            <TableCell>Thời Gian</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {locations.map((location, index) => (
                            <TableRow key={location.id}>
                                <TableCell align="center">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" className="location-name"
                                                onClick={() => handleNavigateToItem(location)}>
                                        {location.place}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {location.description}
                                </TableCell>
                                <TableCell>
                                    {DateUtil.renderDate(location)}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(location)}>
                                        <Edit/>
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(location)}>
                                        <Delete/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {/* Edit dialog */}
            <LocationDialog open={dialogOpened} onClose={onEditDialogClose} location={choseLocation} isRefresh={setRefresh}/>
            {/* Delete dialog */}
            {choseLocation && (
                <Dialog id="delete-collection-dialog" open={dltDialogOpened} onClose={onDeleteDialogClose}>
                    <DialogTitle>Xóa Địa Điểm</DialogTitle>
                    <DialogContent>
                        Bạn có chắc là muốn xóa địa điểm <b><i>{choseLocation.place}</i></b>?
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

export default LocationComponent;
