import { CircularProgress, Drawer, makeStyles } from "@material-ui/core";
import { useEffect, useRef } from "react";
import Chart from 'chart.js';
import { useGraphQL } from "../hooks/graphql";
import { PrecipitationHistoryQuery, TemperatureHistoryQuery } from "../graphql/queries/HistoryQueries";
import { anomToGross, prettyVariable } from "../utils/string";
import { DrawerPanel } from "./DrawerPanel";

const DRAWER_HEIGHT = 280;
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: '100vw',
        minHeight: DRAWER_HEIGHT,
        maxHeight: DRAWER_HEIGHT,
        flexShrink: 0,
    },
    drawerPaper: {
        width: '100vw',
        minHeight: DRAWER_HEIGHT,
        maxHeight: DRAWER_HEIGHT,
        backgroundColor: 'rgba(250, 250, 250, 1)',
        overflow: 'hidden'
    },
}));

export const DataDrawer = ({ featuresCollection, clickedFeature, input }) => {
    const classes = useStyles();


    return <Drawer
        className={classes.drawer}

        variant="persistent"
        anchor="bottom"
        open={clickedFeature != null}
        classes={{
            paper: classes.drawerPaper,
        }}>

        {/* mount Panel component (w. charts) only if a country with data has been clicked on */}
        {clickedFeature &&
            <DrawerPanel
                featuresCollection={featuresCollection}
                clickedFeature={clickedFeature}
                input={input} />}
    </Drawer>
}