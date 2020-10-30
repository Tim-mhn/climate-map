import React, { useEffect, useMemo, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { Select } from "@chakra-ui/core";
import 'mapbox-gl/dist/mapbox-gl.css';
import { getAllGeoJSONs } from '../utils/geojson'
import { TemperatureQuery, PrecipitationQuery } from '../graphql/queries/ForecastsQueries';
import { useGraphQL } from '../hooks/graphql';
import { useForm } from '../hooks/form';
import { updateFeaturesCollection } from '../utils/featuresCollection';
import DiscreteSlider from './DiscreteSlider';
import { useFetchAll } from '../hooks/fetch';
import { BASIC_REQ_TIME_PERIODS } from '../utils/constants';
import { stripIgnoredCharacters } from 'graphql';


export const RMapGL = () => {

    const iniViewport = {
        width: 1600,
        height: 800,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 1
    }


    const [featuresCollection, setFeaturesCollection] = useState(null);
    const [viewport, setViewport] = useState(iniViewport);
    // const [dataLayer, setDataLayer] = useState(iniDataLayer);
    const [input, setInput] = useForm({ fromYear: "2020", scenario: "a2", variable: "temperature" });

    // Fetch Temperature + Precipitation data
    const { temperature, precipitation } = useFetchAll();
    const [tLoading, tError, tData] = temperature;
    const [prLoading, prError, prData] = precipitation;


    // Load GeoJSON data of all countries only on startup
    useEffect(() => {
        getAllGeoJSONs().then(geojsons => {
            // setFeaturesCollection(geojsons);
            let updatedFeatures = updateFeaturesCollection(geojsons, tData, "temperature");
            updatedFeatures = updateFeaturesCollection(updatedFeatures, prData, "precipitation");
            setFeaturesCollection(updatedFeatures);
        });
    }, [tData, prData]);


    // Update "reference" value for country colouring on scenario update
    useEffect(() => {
        if (featuresCollection) _updateColourRefValue(featuresCollection, input)
    }, [input]);

    // Update styles data layer on features collection update
    const dataLayer = useMemo( ()  => {
        const colours = ["#8e5c49", "#ca9465", "#f0a824", "#ded0ff", "#ccfbff", 
        "#d3ffd1", "#f9fddc", "#ffd6d6", "#55362a"];
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
            

            let allValues = featuresCollection.features.map(f => f.properties.value);
            allValues = allValues.filter(x => x != 0);
            const max = Math.max(...allValues);
            const min = Math.min(...allValues);
            const step = (max-min)/(colours.length-1);

            const stops = colours.map((c, idx) => [(min+step*idx), c]);

            dataLayer.paint['fill-color'].stops = stops;
            console.log(dataLayer)            
        }

        return dataLayer
    }, [featuresCollection])


    // Set the value used for country colour by looking into property 
    // and finding the element that has field attribute = filterVal
    const _updateColourRefValue = (featuresColl, input) => {
        const featuresWithRefVal = featuresColl.features.map(feature => {
            let prop = feature.properties[input.variable];
            
            const filter = (({ variable, ...o }) => o)(input) // Copy all key, values into filter except for "variable"

            // Find first element that matches all values in input (scenario, fromYear, ...)
            let refValue = prop ? prop.find(el => Object.keys(filter).every(key => el[key] == filter[key])).value[0] : 0;

            // refValue += Math.random() * 10;
            const updatedProperties = { ...feature.properties, "value": refValue };


            return { ...feature, "properties": updatedProperties }
        });

        const updatedFeaturesColl = { ...featuresColl, "features": featuresWithRefVal };
        console.log("Features collection updated after input update");
        console.log(updatedFeaturesColl)
        setFeaturesCollection(updatedFeaturesColl);
    }



    const Map = () => {



        var TOKEN = "pk.eyJ1IjoidGltaG4iLCJhIjoiY2tnbW1pZ2czMDVwYTJ1cXBkZzJjcXMxaCJ9.UNBlavlP3hhSmT5f7DRdBA"

        // const geoJsonData = this.getUSGeoJson();
        

        // const { viewport, data } = this.state;

        return (
            <div style={{ height: '100%', position: 'relative' }}>
                <ReactMapGL
                    {...viewport}
                    onViewportChange={(vp) => setViewport(vp)}
                    // onClick={() => _loadTemperatureData()}
                    mapboxApiAccessToken={TOKEN}>

                    <Source type="geojson" data={featuresCollection}>
                        <Layer {...dataLayer}></Layer>
                    </Source>
                </ReactMapGL>

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