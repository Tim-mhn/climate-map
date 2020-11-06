import React, { useEffect, useMemo, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { getAllGeoJSONs } from '../utils/geojson'
import { useForm } from '../hooks/form';
import { anomToGross, getForecastValueFromProp, isInputVariableAnom, updateFeaturesCollection } from '../utils/featuresCollection';
import DiscreteSlider from './DiscreteSlider';
import { useFetchAll } from '../hooks/fetch';
import { DATA_LAYER_STOPS, DATA_LAYER_COLOURS, BASIC_REQ_TIME_PERIODS, MONTHS, MAPBOX_TOKEN } from '../utils/constants';


export const RMapGL = () => {

    const iniViewport = {
        // width: 100,
        // height: 800, 
        // height: "100vh",
        // width: "100vw",
        latitude: 40,
        longitude: -100,
        zoom: 1
    }
    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));

    const classes = useStyles();


    const [featuresCollection, setFeaturesCollection] = useState(null);
    const [iniColourRender, setIniColourRender] = useState(0);
    const [viewport, setViewport] = useState(iniViewport);
    const [input, setInput] = useForm({ fromYear: "2020", scenario: "a2", variable: "temperature", granulation: "year", "month": 0, "relative": false });

    // Fetch all time Temperature + Precipitation average and anomaly  data
    const [alltimeQueriesResp, fetchedAll] = useFetchAll();




    // Load GeoJSON data of all countries only on startup
    useEffect(() => {

        if (fetchedAll) {
            console.count("Use effect called")
            console.info(alltimeQueriesResp)
            getAllGeoJSONs().then(geojsons => {
                let updatedFeatures = geojsons;

                Object.entries(alltimeQueriesResp).forEach(([queryName, queryRes]) => {
                    const [loading, error, data] = queryRes;
                    if (data) updatedFeatures = updateFeaturesCollection(updatedFeatures, data, queryName);
                });

                setFeaturesCollection(updatedFeatures);
                setIniColourRender(iniColourRender + 1);
            });
        }
    }, [fetchedAll]);

    // Update "reference" value for country colouring on scenario update in featuresCollection
    useEffect(() => {
        if (featuresCollection) _updateColourRefValue(featuresCollection, input)
    }, [iniColourRender, input]);




    // Update styles data layer on features collection update
    const dataLayer = useMemo(() => {
        const dataLayer = {
            id: 'data',
            type: 'fill',
            paint: {
                'fill-color': {
                    property: 'value',
                    stops: [[0, "#000000"]]
                },
                'fill-opacity': 0.95
            }
        };

        if (featuresCollection) {

            let stops = DATA_LAYER_STOPS[input.variable] ? DATA_LAYER_STOPS[input.variable] : DATA_LAYER_STOPS["default"];
            // Assert that stops and colours have same number of elements !
            if (stops.length != DATA_LAYER_COLOURS.length) {
                throw Error(`Error in updating data layer paint. Stops and colours don't have same length ${DATA_LAYER_STOPS} --- ${DATA_LAYER_COLOURS}`);
            }
            stops = stops.map((st, idx) => [st, DATA_LAYER_COLOURS[idx]]);

            dataLayer.paint['fill-color'].stops = stops;
        }

        return dataLayer
    }, [featuresCollection]);


    const _getRelativeAnom = (featureProperties, input) => {
        const anomProp = featureProperties[input.variable]; // 'temperatureAnom' property ie
        const grossProp = featureProperties[anomToGross(input.variable)]; // 'temperature' property ie
        const grossValue = getForecastValueFromProp(grossProp, input);
        const anomValue = getForecastValueFromProp(anomProp, input);
        return anomValue / grossValue;


    }
    // Set the value used for country colour by looking into property 
    // and finding the element that has field attribute = filterVal
    const _updateColourRefValue = (featuresColl, input) => {

        const featuresWithRefVal = featuresColl.features.map(feature => {
            let prop = feature.properties[input.variable];

            let refValue;
            try {
                refValue = (input.relative && isInputVariableAnom(input)) ? _getRelativeAnom(feature.properties, input) : getForecastValueFromProp(prop, input);
            } catch (e) {
                console.error(e.message);
                refValue = null
            };

            const updatedProperties = { ...feature.properties, "value": refValue };
            return { ...feature, "properties": updatedProperties }
        });

        console.info(featuresWithRefVal);
        const updatedFeaturesColl = { ...featuresColl, "features": featuresWithRefVal };
        setFeaturesCollection(updatedFeaturesColl);
    }


    const periodMarks = Object.entries(BASIC_REQ_TIME_PERIODS).map(([start, end]) => {
        return { label: `${start}-${end}`, value: Number.parseInt(start) }
    });

    const monthMarks = MONTHS.map((month, idx) => { return { "value": idx, "label": month } });

    const Map = () => {


        return (
            <Grid container>
                <Grid container item direction='row' xs={12} spacing={2}>

                    <Grid container item direction='column' xs={10} spacing={2}>
                        {/* Map */}

                        <Grid item xs={8}>
                            {/**TODO:
                             * load map as soon as data for selected input is ready (average temperature on load)
                             */}
                            {fetchedAll ?
                                <ReactMapGL
                                    width='100vw'
                                    height='100vh'
                                    {...viewport}
                                    onViewportChange={(vp) => setViewport(vp)}
                                    mapboxApiAccessToken={MAPBOX_TOKEN}>

                                    <Source type="geojson" data={featuresCollection}>
                                        <Layer {...dataLayer}></Layer>
                                    </Source>
                                </ReactMapGL>
                                :
                                <CircularProgress
                                    size={100}
                                />
                            }
                        </Grid>
                    </Grid>


                    <Grid container item direction='column' xs={2} spacing={1} justify='flex-start' style={{ 'zIndex': 999 }}>
                        {/* Inputs */}

                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="variable-select-label">Variable</InputLabel>
                            <Select
                                labelId="variable-select-label"
                                name="variable"
                                label="variable"
                                // placeholder="Select variable"
                                defaultValue="temperature"
                                onChange={setInput}
                            >
                                {Object.keys(alltimeQueriesResp).map(queryName => {
                                    return <MenuItem value={queryName}>{queryName}</MenuItem>
                                })}

                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="scenario-select-label">Variable</InputLabel>
                            <Select
                                name="scenario"
                                label="scenario"
                                labelId="scenario-select-label"
                                placeholder="Select scenario"
                                defaultValue="a2"
                                onChange={setInput}
                            >
                                <MenuItem value="a2">a2</MenuItem>
                                <MenuItem value="b1">b1</MenuItem>
                            </Select>
                        </FormControl>


                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="granulation-select-label">Variable</InputLabel>
                            <Select
                                name="granulation"
                                label="granulation"
                                labelId="granulation-select-label"                                defaultValue="year"
                                onChange={setInput}
                            >
                                <MenuItem value="year">Year</MenuItem>
                                <MenuItem value="month">Month</MenuItem>
                            </Select>
                        </FormControl>

                        <Grid item>
                            <FormControlLabel
                                control={
                                    <Switch
                                        defaultChecked={false}
                                        onChange={setInput}
                                        name="relative"
                                        color="primary"
                                        disabled={!isInputVariableAnom(input)}
                                    />
                                }
                                label="Relative anomaly"
                            />
                        </Grid>

                        <Grid item >
                            <DiscreteSlider
                                label="Period"
                                name="fromYear"
                                handleChange={setInput}
                                marks={periodMarks}
                            />
                        </Grid>
                        <Grid item >
                            {
                                input.granulation == "month" ?

                                    <DiscreteSlider
                                        label="Month"
                                        name="month"
                                        handleChange={setInput}
                                        marks={monthMarks}
                                    />

                                    :

                                    <span></span>
                            }
                        </Grid>
                    </Grid>

                </Grid>

            </Grid>

        );
    }

    return Map(); 
}

