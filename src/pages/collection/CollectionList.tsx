import './CollectionList.scss';
import {ChangeEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "@tanstack/react-query";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    FormControl,
    IconButton,
    Input,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";
import {Add, Delete, Edit, KeyboardArrowRight} from "@mui/icons-material";
// Components
import AppLoader from "../../components/app-loader/AppLoader.tsx";
import CollectionDialog from "./collection-dialog/CollectionDialog";
import DeleteCollectionDialog from "./delete-collection-dialog/DeleteCollectionDialog.tsx";
// Models & Constants
import {Collection} from "@models/Collection.ts";
import {PathName} from "@constants/Page.ts";
import {TAGS} from "@constants/Tag.ts";
// Utils & Services
import {useCollectionQuery} from "@queries/CollectionQueryHook.ts";
import {DateUtil} from "@utils/DateUtil.ts";
import {isTabletOrPhone} from "@utils/ScreenUtil.ts";

function CollectionList() {
    const [tags, setTags] = useState<string[]>([]);
    const [choseCollection, setChoseCollection] = useState<Collection | null>(null);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [dltDialogOpened, setDltDialogOpened] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [page, setPage] = useState(0);
    const [numOfCollections, setNumOfCollections] = useState(0);

    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const queryClient = useQueryClient();
    const collectionQuery = useCollectionQuery({page, size: rowsPerPage, tags: tags.join(",")});

    const currentUser = useAppSelector(state => state.user.value);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `MEMORIA | ${t("page.collection")}`;

        if (collectionQuery.isError) {
            dispatch(openSnackbar({type: "error", message: t("collection.cannot_load")}));
        }
    }, [collectionQuery.isError, dispatch, t]);

    useEffect(() => {
        if (collectionQuery.data) {
            setNumOfCollections(Number(collectionQuery.data.header.get("x-total-count")));
        }
    }, [collectionQuery.data]);

    const refreshCollections = (page: number, size: number, tags?: string) => {
        queryClient.invalidateQueries({queryKey: ['getAllCollectionsHavingAccess', {page, size, tags}]}).catch(() => {
            dispatch(openSnackbar({type: "error", message: t("collection.cannot_load")}));
        });
    }

    const handleFilterTagChange = (event: SelectChangeEvent<string[]>) => {
        const {target: {value}} = event;
        setTags(typeof value === 'string' ? value.split(',') : value);
    };

    const isCollectionOwner = (collection: Collection) => {
        if (currentUser && collection.ownerEmail) {
            return currentUser.email === collection.ownerEmail;
        }
        return false;
    }

    const handleNavigateToLocation = (collection: Collection) => {
        navigate(`/${PathName.LOCATION}?id=${collection.id}`);
    }

    const handleOnChangePage = (newPage: number) => {
        setPage(newPage);
        refreshCollections(newPage, rowsPerPage);
    }

    const handleOnChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        refreshCollections(0, parseInt(event.target.value, 10));
    };

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

    const getTagTranslation = (tagName: string): string => {
        switch (tagName) {
            case "FAMILY":
                return t("tags.family");
            case "FRIENDS":
                return t("tags.friends");
            case "COLLEAGUES":
                return t("tags.colleagues");
            case "LOVER":
                return t("tags.lover");
            default:
                return "";
        }
    }

    const renderCollectionList = () => {
        if (isTabletOrPhone()) {
            return (
                <div className="collection-card-list">
                    {collectionQuery.data?.data.map(collection =>
                        <Card key={collection.id}>
                            <CardContent>
                                <div className="collection-name">
                                    {collection.name}
                                </div>
                                <div className="collection-description">
                                    {collection.description}
                                </div>
                                <div className="title-wrapper">
                                    <div className="collection-title">
                                        {t("collection.modified_date")}
                                    </div>
                                    <div className="collection-title">
                                        {t("collection.tags")}
                                    </div>
                                </div>
                                <div className="date-tag-wrapper">
                                    <div className="collection-date">
                                        {collection.lastModifiedDate ? DateUtil.renderDate(collection.lastModifiedDate) : ''}
                                    </div>
                                    <div className="collection-tag">
                                        {collection.tags?.map(tag =>
                                            <Chip key={tag} label={getTagTranslation(tag)}/>
                                        )}
                                    </div>
                                </div>
                                <div className="collection-title">
                                    {t("collection.shared_email")}
                                </div>
                                <div className="collection-email">
                                    {collection.userEmails.map(email =>
                                        <Chip key={email} variant="outlined" label={email}/>
                                    )}
                                </div>
                            </CardContent>
                            <CardActions>
                                <div className="btn-wrapper">
                                    <IconButton size="small" color="primary"
                                                onClick={() => handleOpenEditDialog(collection)}>
                                        <Edit/>
                                    </IconButton>
                                    <IconButton size="small" color="error"
                                                onClick={() => handleOpenDeleteDialog(collection)}>
                                        <Delete/>
                                    </IconButton>
                                </div>
                                <Button size="small" color="primary" variant="text"
                                        onClick={() => handleNavigateToLocation(collection)}>
                                    {t("button.view_location")}
                                    <KeyboardArrowRight/>
                                </Button>
                            </CardActions>
                        </Card>
                    )}
                </div>
            )
        }
        return (
            <Table className="collection-table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">#</TableCell>
                        <TableCell>
                            {t("collection.name")}
                        </TableCell>
                        <TableCell>
                            {t("collection.description")}
                        </TableCell>
                        <TableCell>
                            {t("collection.tags")}
                        </TableCell>
                        <TableCell>
                            {t("collection.modified_date")}
                        </TableCell>
                        <TableCell>
                            {t("collection.shared_email")}
                        </TableCell>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {collectionQuery.data?.data.map((collection, index) => (
                        <TableRow key={collection.id}>
                            <TableCell align="center">
                                {page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell width={200}>
                                <Typography variant="body1" className="collection-name"
                                            onClick={() => handleNavigateToLocation(collection)}>
                                    {collection.name}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {collection.description}
                            </TableCell>
                            <TableCell>
                                {collection.tags?.map(tag =>
                                    <Chip key={tag} label={getTagTranslation(tag)}/>
                                )}
                            </TableCell>
                            <TableCell width={100}>
                                {collection.lastModifiedDate ? DateUtil.renderDate(collection.lastModifiedDate) : ''}
                            </TableCell>
                            <TableCell>
                                {collection.userEmails.map(email =>
                                    <Chip key={email} variant="outlined" label={email}/>
                                )}
                            </TableCell>
                            {isCollectionOwner(collection) ? (
                                <TableCell align="center" width={80}>
                                    <IconButton size="small" color="primary"
                                                onClick={() => handleOpenEditDialog(collection)}>
                                        <Edit/>
                                    </IconButton>
                                    <IconButton size="small" color="error"
                                                onClick={() => handleOpenDeleteDialog(collection)}>
                                        <Delete/>
                                    </IconButton>
                                </TableCell>
                            ) : <TableCell/>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return (
        <section className="collection-container">
            <div className="collection-bar">
                <FormControl size="small" className="tag-select">
                    <InputLabel id="tag-label">
                        {t("collection.tags")}
                    </InputLabel>
                    <Select labelId="tag-label"
                            multiple
                            value={tags}
                            onChange={handleFilterTagChange}
                            input={<Input/>}
                            renderValue={(selected: string[]) => (
                                selected.map((value: string) => (
                                    <Chip className="tag-chip" size="small"
                                          key={value}
                                          label={getTagTranslation(value)}/>
                                ))
                            )}>
                        {TAGS.map(name => (
                            <MenuItem key={name} value={name}>
                                {getTagTranslation(name)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button className="add-btn" variant={isTabletOrPhone()? 'text':'contained'} startIcon={<Add/>}
                        onClick={() => handleOpenEditDialog()}>
                    {t("button.add")}
                </Button>
            </div>
            {/* Collection List */}
            {collectionQuery.isLoading ? <AppLoader/> : renderCollectionList()}

            {collectionQuery.data?.data && collectionQuery.data?.data.length > 0 && (
                isTabletOrPhone() ? (
                    <Pagination color="primary" count={Math.round(numOfCollections / rowsPerPage) + 1}
                                page={page + 1}
                                onChange={(_event, newPage) => handleOnChangePage(newPage - 1)}/>
                ) : (
                    <TablePagination count={numOfCollections}
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
            <CollectionDialog open={dialogOpened} onClose={onEditDialogClose} collection={choseCollection}/>
            {/* Delete dialog */}
            {choseCollection && <DeleteCollectionDialog open={dltDialogOpened} onClose={onDeleteDialogClose}
                                                        collection={choseCollection}/>}
        </section>
    )
}

export default CollectionList;
