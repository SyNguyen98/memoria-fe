import './CollectionComponent.scss';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {openSnackbar} from "../../reducers/SnackbarReducer";
import {openSidebar} from "../../reducers/SidebarReducer";
import {useAppDispatch, useAppSelector} from "../../app/hook";
import {
    AppBar,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
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
import AppLoader from "../../components/app-loader/AppLoader.tsx";
import CollectionDialog from "./collection-dialog/CollectionDialog";
import DeleteCollectionDialog from "./delete-collection-dialog/DeleteCollectionDialog.tsx";
// Models & Constants
import {Collection} from "../../models/Collection";
import {SessionKey} from "../../constants/Storage";
import {PathName} from "../../constants/Page";
// Utils & Services
import {useCollectionQuery} from "../../custom-query/CollectionQueryHook.ts";
import {DateUtil} from "../../utils/DateUtil.ts";
import {isTabletOrPhone} from "../../utils/ScreenUtil.ts";

function CollectionComponent() {
    const [choseCollection, setChoseCollection] = useState<Collection | null>(null);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [dltDialogOpened, setDltDialogOpened] = useState(false);

    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const collectionQuery = useCollectionQuery();

    const currentUser = useAppSelector(state => state.user.value);
    const navigate = useNavigate();

    useEffect(() => {
        if (collectionQuery.isError) {
            dispatch(openSnackbar({type: "error", message: t("collection.cannot_load")}));
        }
    }, [collectionQuery.isError, dispatch, t]);

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
        navigate(`/${PathName.LOCATION}?id=${collection.id}`);
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

    const getLabelTag = (tagName: string): string => {
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
                    {collectionQuery.data?.map(collection =>
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
                                            <Chip key={tag} label={getLabelTag(tag)}/>
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
                    {collectionQuery.data?.map((collection, index) => (
                        <TableRow key={collection.id}>
                            <TableCell align="center">
                                {index + 1}
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
                                    <Chip key={tag} label={getLabelTag(tag)}/>
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
            {/* App Bar */}
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit"
                                aria-label="menu"
                                onClick={handleOpenMenu}>
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        {t("page.collection")}
                    </Typography>
                    <Button className="add-btn" variant="outlined" startIcon={<Add/>}
                            onClick={() => handleOpenEditDialog()}>
                        {t("button.add")}
                    </Button>
                </Toolbar>
            </AppBar>
            {/* Collection List */}
            {collectionQuery.isLoading ? <AppLoader/> : renderCollectionList()}
            {/* Edit dialog */}
            <CollectionDialog open={dialogOpened} onClose={onEditDialogClose} collection={choseCollection}/>
            {/* Delete dialog */}
            {choseCollection && <DeleteCollectionDialog open={dltDialogOpened} onClose={onDeleteDialogClose}
                                                        collection={choseCollection}/>}
        </section>
    )
}

export default CollectionComponent;
