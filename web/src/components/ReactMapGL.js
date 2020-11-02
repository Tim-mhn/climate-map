import React, { useEffect, useMemo, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { Select } from "@chakra-ui/core";
import 'mapbox-gl/dist/mapbox-gl.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { getAllGeoJSONs } from '../utils/geojson'
import { useForm } from '../hooks/form';
import { updateFeaturesCollection } from '../utils/featuresCollection';
import DiscreteSlider from './DiscreteSlider';
import { useFetchAll } from '../hooks/fetch';
import { DATA_LAYER_STOPS, DATA_LAYER_COLOURS, BASIC_REQ_TIME_PERIODS, MONTHS } from '../utils/constants';


export const RMapGL = () => {

    const iniViewport = {
        width: 1600,
        height: 800,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 1
    }


    const [featuresCollection, setFeaturesCollection] = useState(null);
    const [iniColourRender, setIniColourRender] = useState(0);
    const [viewport, setViewport] = useState(iniViewport);
    const [input, setInput] = useForm({ fromYear: "2020", scenario: "a2", variable: "temperature", granulation: "year", "month": 0 });

    // Fetch Temperature + Precipitation data
    const { temperature, precipitation } = useFetchAll();
    const [tLoading, tError, tData] = temperature;
    const [prLoading, prError, prData] = precipitation;


    // Load GeoJSON data of all countries only on startup
    useEffect(() => {
        if (tData && prData) {
            getAllGeoJSONs().then(geojsons => {
                let updatedFeatures = updateFeaturesCollection(geojsons, tData, "temperature");
                updatedFeatures = updateFeaturesCollection(updatedFeatures, prData, "precipitation");
                setFeaturesCollection(updatedFeatures);
                setIniColourRender(iniColourRender + 1);
            });
        }
    }, [tData, prData]);


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



            let stops = DATA_LAYER_STOPS[input.variable];
            // Assert that stops and colours have same number of elements !
            if (stops.length != DATA_LAYER_COLOURS.length) {
                console.error(stops);
                console.error(stops.length)
                throw Error(`Error in updating data layer paint. Stops and colours don't have same length ${DATA_LAYER_STOPS} --- ${DATA_LAYER_COLOURS}`);
            }
            stops = stops.map((st, idx) => [st, DATA_LAYER_COLOURS[idx]]);

            dataLayer.paint['fill-color'].stops = stops;
        }

        return dataLayer
    }, [featuresCollection]);


    // Set the value used for country colour by looking into property 
    // and finding the element that has field attribute = filterVal
    const _updateColourRefValue = (featuresColl, input) => {
        console.log("updating colour ref value")
        const featuresWithRefVal = featuresColl.features.map(feature => {
            let prop = feature.properties[input.variable];
            const refKey = input.granulation == "year" ? "annualVal" : "monthVals"

            const filter = (({ variable, granulation, month, ...o }) => o)(input) // Copy all key, values into filter except for "variable"

            const idx = input.granulation == "year" ? 0 : input.month
            // Find first element that matches all values in input (scenario, fromYear, ...)
            let refValue;
            try {
                refValue = prop ? prop.find(el => Object.keys(filter).every(key => el[key] == filter[key]))[refKey][idx] : null;
            } catch (e) {
                console.error(e);
                console.log(prop);
                console.log(filter);
                console.log(refKey);
                refValue = null;
            }

            // refValue += Math.random() * 10;
            const updatedProperties = { ...feature.properties, "value": refValue };


            return { ...feature, "properties": updatedProperties }
        });

        const updatedFeaturesColl = { ...featuresColl, "features": featuresWithRefVal };
        setFeaturesCollection(updatedFeaturesColl);
    }


    const periodMarks = Object.entries(BASIC_REQ_TIME_PERIODS).map(([start, end]) => {
        return { label: `${start}-${end}`, value: Number.parseInt(start) }
    });

    const monthMarks = MONTHS.map((month, idx) => { return { "value": idx, "label": month } });

    const Map = () => {



        var TOKEN = "pk.eyJ1IjoidGltaG4iLCJhIjoiY2tnbW1pZ2czMDVwYTJ1cXBkZzJjcXMxaCJ9.UNBlavlP3hhSmT5f7DRdBA"

        return (
            <div style={{ height: '100%', position: 'relative' }}>
                { tData && prData ?
                    <ReactMapGL
                        {...viewport}
                        onViewportChange={(vp) => setViewport(vp)}
                        mapboxApiAccessToken={TOKEN}>

                        <Source type="geojson" data={featuresCollection}>
                            <Layer {...dataLayer}></Layer>
                        </Source>
                    </ReactMapGL>
                    : <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        style={{ height: iniViewport.height, width: iniViewport.width }}
                    >
                        <CircularProgress
                            size={100}
                        />
                    </Grid>
                }


                <Select
                    name="scenario"
                    placeholder="Select scenario"
                    defaultValue="a2"
                    onChange={setInput}
                >
                    <option value="a2">a2</option>
                    <option value="b1">b1</option>
                </Select>

                <Select
                    name="variable"
                    placeholder="Select variable"
                    defaultValue="temperature"
                    onChange={setInput}
                >
                    <option value="precipitation">Precipitation</option>
                    <option value="temperature">Temperature</option>
                </Select>
                    <Select
                        name="granulation"
                        placeholder="Select granulation"
                        defaultValue="year"
                        onChange={setInput}
                    >
                        <option value="year">Year</option>
                        <option value="month">Month</option>
                    </Select>

                    
                


                <DiscreteSlider
                    label="Period"
                    name="fromYear"
                    handleChange={setInput}
                    marks={periodMarks}
                />
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

            </div>

        );
    }

    return Map();
}

// export const RMapGL = Map;