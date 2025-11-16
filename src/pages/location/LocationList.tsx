import './LocationList.scss';
import {ChangeEvent, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router";
import {useQueryClient} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";
import {usePagingLocationQuery} from "@queries/LocationQueryHook.ts";
import {useCollectionByIdQuery} from "@queries/CollectionQueryHook.ts";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {Add, Delete, Edit, KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
// Components
import AppLoader from "../../components/app-loader/AppLoader.tsx";
import LocationDialog from "./location-dialog/LocationDialog";
import DeleteLocationDialog from "./delete-location-dialog/DeleteLocationDialog.tsx";
// Models & Constants
import {Location} from "@models/Location.ts";
import {PathName} from "@constants/Page.ts";
// Utils & Services
import {DateUtil} from "@utils/DateUtil.ts";
import {isTabletOrPhone} from "@utils/ScreenUtil.ts";

function LocationList() {
    const [collectionId, setCollectionId] = useState('');
    const [choseLocation, setChoseLocation] = useState<Location | null>(null);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [dltDialogOpened, setDltDialogOpened] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [page, setPage] = useState(0);
    const [numOfLocations, setNumOfLocations] = useState(0);

    const currentUser = useAppSelector(state => state.user.value);
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const queryClient = useQueryClient();
    const locationQuery = usePagingLocationQuery(collectionId, page, rowsPerPage);
    const collectionQuery = useCollectionByIdQuery(collectionId);

    useEffect(() => {
        if (collectionQuery.data) {
            document.title = `MEMORIA | ${collectionQuery.data.name}`;
        }
    }, [collectionQuery.data]);

    useEffect(() => {
        const collectionId = searchParams.get("id");
        if (collectionId) {
            setCollectionId(collectionId);
            refreshLocations(page, rowsPerPage);
        }
    }, [dispatch, queryClient, searchParams, t]);

    useEffect(() => {
        if (locationQuery.data) {
            setNumOfLocations(Number(locationQuery.data.header.get("x-total-count")));
        }
    }, [locationQuery.data]);


    const refreshLocations = (page: number, size: number) => {
        queryClient.invalidateQueries({queryKey: ['getPagingLocationsByParams', collectionId, page, size]}).catch(() => {
            dispatch(openSnackbar({type: "error", message: t("location.cannot_load")}));
        });
    }

    const isCollectionOwner = () => {
        const ownerEmail = collectionQuery.data?.ownerEmail;
        if (currentUser && ownerEmail) {
            return currentUser.email === ownerEmail;
        }
        return false;
    }

    const handleNavigateToItem = (location: Location) => {
        navigate(`/${PathName.ITEM}?id=${location.id}`);
    }

    const handleOpenEditDialog = (location?: Location) => {
        setDialogOpened(true);
        setChoseLocation(location ?? null);
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

    const handleOnChangePage = (newPage: number) => {
        setPage(newPage);
        refreshLocations(newPage, rowsPerPage);
    }

    const handleOnChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        refreshLocations(0, parseInt(event.target.value, 10));
    };

    const renderLocationList = () => {
        if (isTabletOrPhone()) {
            return (
                <div className="location-card-list">
                    {locationQuery.data?.data.map(location => (
                        <Card key={location.id}>
                            <CardContent>
                                <div className="location-place"
                                     onClick={() => handleNavigateToItem(location)}>
                                    {location.place}
                                </div>
                                <div className="location-description">
                                    {location.description}
                                </div>
                                <div className="location-title">
                                    {t("collection.modified_date")}
                                </div>
                                <div className="location-date">
                                    {DateUtil.renderDateTime(location)}
                                </div>
                            </CardContent>
                            <CardActions>
                                <div className="btn-wrapper">
                                    <IconButton size="small" color="primary"
                                                onClick={() => handleOpenEditDialog(location)}>
                                        <Edit/>
                                    </IconButton>
                                    <IconButton size="small" color="error"
                                                onClick={() => handleOpenDeleteDialog(location)}>
                                        <Delete/>
                                    </IconButton>
                                </div>
                                <Button size="small" color="primary" variant="text"
                                        onClick={() => handleNavigateToItem(location)}>
                                    {t("button.view_item")}
                                    <KeyboardArrowRight/>
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </div>
            )
        }
        return (
            <Table className="location-table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">#</TableCell>
                        <TableCell>
                            {t("location.0")}
                        </TableCell>
                        <TableCell>
                            {t("location.description")}
                        </TableCell>
                        <TableCell>
                            {t("location.time")}
                        </TableCell>
                        {isCollectionOwner() && <TableCell/>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {locationQuery.data?.data.map((location, index) => (
                        <TableRow key={location.id}>
                            <TableCell align="center" width={50}>
                                {page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell width={300}>
                                <Typography variant="body1" className="location-name"
                                            onClick={() => handleNavigateToItem(location)}>
                                    {location.place}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {location.description}
                            </TableCell>
                            <TableCell width={130}>
                                {DateUtil.renderDateTime(location)}
                            </TableCell>
                            {isCollectionOwner() && (
                                <TableCell align="center" width={80}>
                                    <IconButton size="small" color="primary"
                                                onClick={() => handleOpenEditDialog(location)}>
                                        <Edit/>
                                    </IconButton>
                                    <IconButton size="small" color="error"
                                                onClick={() => handleOpenDeleteDialog(location)}>
                                        <Delete/>
                                    </IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return (
        <section className="location-container">
            {isTabletOrPhone() ? (
                <Button className="back-btn" variant="text"
                        onClick={() => navigate(`/${PathName.COLLECTION}`)}>
                    <KeyboardArrowLeft/> {t("button.back")}
                </Button>
            ) : null}
            <div className="collection-bar">
                {isTabletOrPhone() ? (
                    <>
                        <Typography variant="h6">
                            {collectionQuery.data?.name}
                        </Typography>
                        <Button className="add-btn" variant="text"
                                onClick={() => handleOpenEditDialog()}>
                            <Add/> {t("button.add")}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button className="back-btn" variant="text"
                                onClick={() => navigate(`/${PathName.COLLECTION}`)}>
                            <KeyboardArrowLeft/> {t("button.back")}
                        </Button>
                        <Button className="add-btn" variant="contained" startIcon={<Add/>}
                                onClick={() => handleOpenEditDialog()}>
                            {t("button.add")}
                        </Button>
                    </>
                )}
            </div>
            {/* Location List */}
            {locationQuery.isLoading ? <AppLoader/> : renderLocationList()}

            {locationQuery.data?.data && locationQuery.data?.data.length > 0 && (
                isTabletOrPhone() ? (
                    <Pagination color="primary" count={Math.floor(numOfLocations / rowsPerPage) + 1}
                                page={page + 1}
                                onChange={(_event, newPage) => handleOnChangePage(newPage - 1)}/>
                ) : (
                    <TablePagination count={numOfLocations}
                                     page={page}
                                     onPageChange={(_event, newPage) => handleOnChangePage(newPage)}
                                     rowsPerPage={rowsPerPage}
                                     rowsPerPageOptions={[5, 10, 20, 50]}
                                     onRowsPerPageChange={handleOnChangeRowsPerPage}
                                     labelRowsPerPage={t("table.rows_per_page")}
                                     labelDisplayedRows={({from, to, count}) => t("table.displayed_rows", {
                                         from,
                                         to,
                                         count
                                     })}/>
                )
            )}

            {/* Edit dialog */}
            <LocationDialog open={dialogOpened} onClose={onEditDialogClose} location={choseLocation}/>
            {/* Delete dialog */}
            <DeleteLocationDialog open={dltDialogOpened} onClose={onDeleteDialogClose} location={choseLocation}/>
        </section>
    )
}

export default LocationList;
