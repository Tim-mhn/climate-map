import React, { useEffect, useMemo, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { getAllGeoJSONs } from '../utils/geojson'
import { useForm } from '../hooks/form';
import { anomToGross, isAnomVariable } from '../utils/string';
import { useFetchAll } from '../hooks/fetch';
import InputBoard from './InputBoard';
import ForecastMap from './Map';
import { ColourLegend } from './ColourLegend';
import { getDataLayerStops, getForecastValueFromProp, updateFeaturesCollection } from '../utils/features'
import CircularStatic from './CircularProgressWithLabel';

export const Main = () => {

    const [featuresCollection, setFeaturesCollection] = useState(null);
    const [iniColourRender, setIniColourRender] = useState(false);
    const [input, setInput] = useForm({ fromYear: "2020", scenario: "a2", variable: "temperature", granulation: "year", "month": 0, "relative": false });

    // Fetch all time Temperature + Precipitation average and anomaly data
    const alltimeQueriesResp = useFetchAll();
    const [resolvedQueries, setResolvedQueries] = useState({}); // Map of resolved queries to limit featuresCollection update (only update with new data)
    const [progress, setProgress] = useState(10);

    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
      }, 800);
      return () => {
        clearInterval(timer);
      };
    }, []);




    // Load GeoJSON data of all countries only on startup
    useEffect( () => {
        getAllGeoJSONs().then(geojsons => {
            let updatedFeatures = geojsons;
            setFeaturesCollection(updatedFeatures);
        });
    }, []);

    useEffect(() => {
        if (!featuresCollection) { return; }
        _addResolvedQueriesToFeatures(featuresCollection)
    }, [alltimeQueriesResp]);

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

            let stops = getDataLayerStops(input);
            dataLayer.paint['fill-color'].stops = stops;
        }

        return dataLayer
    }, [featuresCollection]);

    const _addResolvedQueriesToFeatures = (updatedFeatures) => {
        updatedFeatures = updatedFeatures ? updatedFeatures : featuresCollection;
        Object.entries(alltimeQueriesResp).forEach(([queryName, queryResp]) => {
            const [_, __, data] = queryResp;
            // Only update if query has been resolved for the first time
                if (data && !(queryName in resolvedQueries)) {
                try {
                    updatedFeatures = updateFeaturesCollection(updatedFeatures, data, queryName);
                    resolvedQueries[queryName] = true
                } catch (err) { 
                    console.error(err.message) 
                }
            }
        });

        setResolvedQueries(resolvedQueries)
        setFeaturesCollection(updatedFeatures);

        if (alltimeQueriesResp[input.variable][2] && !iniColourRender) setIniColourRender(true); 
    }


    const _getRelativeAnom = (featureProperties, input) => {
        const anomProp = featureProperties[input.variable]; // 'temperatureAnom' property ie
        const grossProp = featureProperties[anomToGross(input.variable)]; // 'temperature' property ie
        let grossValue = Math.abs(getForecastValueFromProp(grossProp, input));
        let anomValue = getForecastValueFromProp(anomProp, input);
        return 100 * anomValue / grossValue;


    }
    // Set the value used for country colour by looking into property 
    // and finding the element that has field attribute = filterVal
    const _updateColourRefValue = (featuresColl, input) => {
        let valBuff = [];
        const featuresWithRefVal = featuresColl.features.map(feature => {
            let prop = feature.properties[input.variable];

            let refValue;
            try {
                refValue = (input.relative && isAnomVariable(input.variable)) ? _getRelativeAnom(feature.properties, input) : getForecastValueFromProp(prop, input);
                if (refValue) valBuff.push(refValue)
            } catch (e) {
                console.error(e.message);
                refValue = null
            };

            const updatedProperties = { ...feature.properties, "value": refValue };

            return { ...feature, "properties": updatedProperties }
        });
        const updatedFeaturesColl = { ...featuresColl, "features": featuresWithRefVal };
        setFeaturesCollection(updatedFeaturesColl);
    }



    const MapWrapper = () => {


        return (
            <Grid container direction='row' alignItems="stretch" style={{ 'height': '100%' }}>
                <Grid container item direction='column' justify='center' xs={12} spacing={2}>
                    {iniColourRender ? <Grid container item direction='row' xs={12}>
                        <Grid container item direction='column' justify='center' xs={9} spacing={2}>

                            <Grid item xs={8}>
                                <ForecastMap
                                    featuresCollection={featuresCollection}
                                    dataLayer={dataLayer}
                                    input={input}
                                />

                            </Grid>

                        </Grid>

                        <Grid container item direction='column' xs={3} spacing={1} justify='flex-start' style={{ 'zIndex': 999, 'paddingTop': '8px', 'paddingRight': '16px' }}>
                            {/* Inputs */}
                            <InputBoard
                                input={input}
                                setInput={setInput}
                                alltimeQueriesResp={alltimeQueriesResp} />

                            <ColourLegend
                                colorStops={dataLayer.paint["fill-color"].stops}
                                width={280}
                                input={input}
                            />

                        </Grid>
                    </Grid> :

                        <Grid id='progress-wrapper' container item direction='row' justify='center' alignItems='center' >
                            <CircularStatic
                                size={100}
                                // progress={progress}
                            />
                        </Grid>

                    }

                                               :



                </Grid>

            </Grid>

        );
    }

    return MapWrapper();
}

