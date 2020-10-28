import React, { useEffect, useState} from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { Button } from "@chakra-ui/core";
import { useQuery } from '@apollo/client';
import { getAllGeoJSONs } from '../utils/geojson'
import 'mapbox-gl/dist/mapbox-gl.css';
import { TemperatureQuery, PrecipitationQuery } from '../graphql/queries/ForecastsQueries';
import { useGraphQL } from '../hooks/useGraphQL';
import { Select } from "@chakra-ui/core";
import { useForm } from '../hooks/useForm';
import { updateFeaturesCollection } from '../utils/featuresCollection';

export const RMapGL = () => {

    const vp = {
            width: 1600,
            height: 800,
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 1
        }

    const [featuresCollection, setFeaturesCollection] = useState(null);
    const [viewport, setViewport] = useState(vp);
    const [input, setInput] = useForm({ start: "2020", end: "2039", scenario: "a2", variable: "temperature"});

    // Fetch Temperature + Precipitation data
    // TODO: factorize these 2 as it doubles the number of useEffect called right below
    const [tLoading, tError, tData] = useGraphQL({ start: "2020", end: "2039", query: TemperatureQuery});
    const [prLoading, prError, prData] = useGraphQL({ start: "2020", end: "2039", query: PrecipitationQuery});

    
    // Load GeoJSON data of all countries only on startup
    useEffect( () => {
        getAllGeoJSONs().then(geojsons => {
            // setFeaturesCollection(geojsons);
            let updatedFeatures = updateFeaturesCollection(geojsons, tData, "temperature");
            updatedFeatures = updateFeaturesCollection(updatedFeatures, prData, "precipitation");
            setFeaturesCollection(updatedFeatures);
        });
    }, [tData, prData]);
 

    // Update "reference" value for country colouring on scenario update
    useEffect( () => {
        console.count("Use effect on scenario update :");
        if (featuresCollection) _updateColourRefValue(featuresCollection, input.variable, "scenario", input.scenario)
    }, [input]);


    // Set the value used for country colour by looking into property 
    // and finding the element that has field attribute = filterVal
    const _updateColourRefValue = (featuresColl, property, field, filterVal) => {
        console.count("update colour ref value called")
        const featuresWithRefVal = featuresColl.features.map(feature =>  {
            let prop = feature.properties[property];
            let refValue = prop ? prop.find(el => el[field] == filterVal).value[0] : 0;
            refValue += Math.random() * 10;
            if (prop) console.log("One prop found")
            const updatedProperties = { ...feature.properties, "value": refValue };
            
          
            return { ...feature, "properties": updatedProperties }
        });

        const updatedFeaturesColl =  { ...featuresColl, "features": featuresWithRefVal};
        setFeaturesCollection(updatedFeaturesColl);
    }


    const Map = () => {



        var TOKEN = "pk.eyJ1IjoidGltaG4iLCJhIjoiY2tnbW1pZ2czMDVwYTJ1cXBkZzJjcXMxaCJ9.UNBlavlP3hhSmT5f7DRdBA"

        // const geoJsonData = this.getUSGeoJson();
        const dataLayer = {
            id: 'data',
            type: 'fill',
            paint: {
                'fill-color': {
                    property: 'value',
                    stops: [
                        [0, '#3288bd'],
                        [3, '#66c2a5'],
                        [6, '#abdda4'],
                        [9, '#e6f598'],
                        [12, '#ffffbf'],
                        [15, '#fee08b'],
                        [18, '#fdae61'],
                        [21, '#f46d43'],
                        [24, '#d53e4f']
                    ]
                },
                'fill-opacity': 0.8
            }
        };

        // const { viewport, data } = this.state;

        // this._loadGraphQLData();

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
                <Button variantColor="green" onClick={() => _updateColours()}>Update colours</Button>

                <Select 
                    placeholder="Select scenario" 
                    defaultValue="a2"
                    onChange={setInput}                    
                >
                    <option value="a2">a2</option>
                    <option value="b1">b1</option>
                </Select>

                <Select 
                    placeholder="Select variable" 
                    defaultValue="temperature"
                    onChange={setInput}                    
                >
                    <option value="precipitation">Precipitation</option>
                    <option value="temperature">Temperature</option>
                </Select>


                <p>{tData ? "Data" : "No data"} </p>
            </div>

        );
    }

    return Map();
}

// export const RMapGL = Map;