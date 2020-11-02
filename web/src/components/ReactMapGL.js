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
import { DATA_LAYER_STOPS, DATA_LAYER_COLOURS } from '../utils/constants';


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
    const [input, setInput] = useForm({ fromYear: "2020", scenario: "a2", variable: "temperature" });

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
                setIniColourRender(iniColourRender+1);
            });
        }
    }, [tData, prData]);


    // Update "reference" value for country colouring on scenario update in featuresCollection
    useEffect(() => {
        if (featuresCollection) _updateColourRefValue(featuresCollection, input)
    }, [iniColourRender, input]);

    // Update styles data layer on features collection update
    const dataLayer = useMemo( ()  => {
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
            
            const filter = (({ variable, ...o }) => o)(input) // Copy all key, values into filter except for "variable"

            // Find first element that matches all values in input (scenario, fromYear, ...)
            let refValue = prop ? prop.find(el => Object.keys(filter).every(key => el[key] == filter[key])).value[0] : null;

            // refValue += Math.random() * 10;
            const updatedProperties = { ...feature.properties, "value": refValue };


            return { ...feature, "properties": updatedProperties }
        });

        const updatedFeaturesColl = { ...featuresColl, "features": featuresWithRefVal };
        setFeaturesCollection(updatedFeaturesColl);
    }


    
    const Map = () => {



        var TOKEN = "pk.eyJ1IjoidGltaG4iLCJhIjoiY2tnbW1pZ2czMDVwYTJ1cXBkZzJjcXMxaCJ9.UNBlavlP3hhSmT5f7DRdBA"
        // const useStyles = makeStyles((theme) => ({
        //     root: {
        //       display: 'flex',
        //       '& > * + *': {
        //         marginLeft: theme.spacing(5),
        //       },
        //     },
        //   }));
        // const loaderStyles = useStyles();

        return (
            <div style={{ height: '100%', position: 'relative' }}>
                { tData && prData ? 
                    <ReactMapGL
                        {...viewport}
                        onViewportChange={(vp) => setViewport(vp)}
                        // onClick={() => _loadTemperatureData()}
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
                    style={{height: iniViewport.height, width: iniViewport.width}}
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

                <DiscreteSlider 
                    name="fromYear"
                    handleChange={setInput} 
                    />

            </div>

        );
    }

    return Map();
}

// export const RMapGL = Map;