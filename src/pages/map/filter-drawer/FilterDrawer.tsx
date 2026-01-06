import './FilterDrawer.scss';
import {useEffect, useState} from 'react';
import {useSearchParams} from "react-router";
import {Divider, Drawer, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {SelectChangeEvent} from "@mui/material/Select";
import {useTranslation} from "react-i18next";
import {useCollectionQuery, useYearsOfCollectionQuery} from "@queries/CollectionQueryHook.ts";
import {useAllLocationsQuery} from "@queries/LocationQueryHook.ts";
import {Location} from "@models/Location.ts";

type Props = {
    open: boolean;
    onClose: () => void;
    locationChose: Location | null;
    onChangeCollection: (event: SelectChangeEvent) => void;
    onChangeLocation: (event: SelectChangeEvent) => void;
    onChangeYear: (event: SelectChangeEvent) => void;
}

function FilterDrawer(props: Readonly<Props>) {
    const [collectionId, setCollectionId] = useState("all");
    const [year, setYear] = useState("all");

    const [searchParams, setSearchParams] = useSearchParams();
    const {t} = useTranslation();

    const collectionQuery = useCollectionQuery({unpaged: true});
    const locationQuery = useAllLocationsQuery(collectionId, year);
    const yearsQuery = useYearsOfCollectionQuery(collectionId);

    useEffect(() => {
        setCollectionId(searchParams.get("id") || "all")
        setYear(searchParams.get("year") || "all");
    }, [searchParams]);

    useEffect(() => {
        if (yearsQuery.data) {
            if (year !== "all" && !yearsQuery.data.includes(parseInt(year))) {
                setYear("all");
                const params: Record<string, string> = collectionId !== "all" ? {id: collectionId} : {};
                setSearchParams(params);
            }
        }
    }, [collectionId, setSearchParams, year, yearsQuery.data]);

    return (
        <Drawer anchor="right" open={props.open}
                onClose={props.onClose}>
            <div className="filter-drawer">
                <Typography variant="h6">
                    {t("filter")}
                </Typography>

                <FormControl className="collection-select" size="small" variant="filled">
                    <InputLabel id="collection-select">
                        {t("page.collection")}
                    </InputLabel>
                    <Select labelId="collection-select"
                            variant="filled"
                            value={collectionId}
                            onChange={props.onChangeCollection}>
                        <MenuItem key="all" value="all">
                            {t("select.all")}
                        </MenuItem>
                        {collectionQuery.data?.data.map(collection =>
                            <MenuItem key={collection.id} value={collection.id}>
                                {collection.name}
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>

                <Divider/>

                <FormControl className="year-select" size="small" variant="filled">
                    <InputLabel id="year-select">
                        {t("input.year")}
                    </InputLabel>
                    <Select labelId="year-select"
                            variant="filled"
                            value={year}
                            onChange={props.onChangeYear}>
                        <MenuItem key="all" value="all">
                            {t("select.all")}
                        </MenuItem>
                        {yearsQuery.data?.sort((a, b) => a - b).map(year =>
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>

                <Divider/>

                <FormControl className="location-select" size="small" variant="filled">
                    <InputLabel id="location-select">
                        {t("page.location")}
                    </InputLabel>
                    <Select labelId="location-select"
                            variant="filled"
                            value={props.locationChose?.id}
                            onChange={props.onChangeLocation} >
                        {locationQuery.data?.map(location =>
                            <MenuItem key={location.id} value={location.id}>
                                {location.place}
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
            </div>
        </Drawer>
    );
}

export default FilterDrawer;