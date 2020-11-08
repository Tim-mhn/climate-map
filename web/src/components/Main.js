import React, { useEffect, useMemo, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { getAllGeoJSONs } from '../utils/geojson'
import { useForm } from '../hooks/form';
import { anomToGross, getForecastValueFromProp, isInputVariableAnom, updateFeaturesCollection } from '../utils/featuresCollection';
import { useFetchAll } from '../hooks/fetch';
import { DATA_LAYER_STOPS, DATA_LAYER_COLOURS, MAPBOX_TOKEN } from '../utils/constants';
import InputBoard from './InputBoard';
import ForecastMap from './Map';


export const Main = () => {

    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        root: {
            minWidth: 100,
            backgroundColor: "rgba(255, 255, 255, 0.85)"
        },
    }));

    const classes = useStyles();


    const [featuresCollection, setFeaturesCollection] = useState(null);
    const [iniColourRender, setIniColourRender] = useState(0);
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



    const MapWrapper = () => {


        return (
            <Grid container>
                <Grid container item direction='row' xs={12} spacing={2}>

                    <Grid container item direction='column' xs={9} spacing={2}>
                        {/* Map */}

                        <Grid item xs={8}>
                            {/**TODO:
                             * load map as soon as data for selected input is ready (average temperature on load)
                             */}
                            {fetchedAll ?
                                <ForecastMap 
                                    featuresCollection={featuresCollection} 
                                    dataLayer={dataLayer}
                                    />
                                :
                                <CircularProgress
                                    size={100}
                                />
                            }
                        </Grid>
                    </Grid>


                    <Grid container item direction='column' xs={3} spacing={1} justify='flex-start' style={{ 'zIndex': 999, 'paddingTop': '48px', 'paddingRight': '24px' }}>
                        {/* Inputs */}
                            <InputBoard 
                            input={input} 
                            setInput={setInput} 
                            alltimeQueriesResp={alltimeQueriesResp}/>

                    </Grid>

                </Grid>

            </Grid>

        );
    }

    return MapWrapper();
}

