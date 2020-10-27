import React, { useEffect, useState} from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { Button } from "@chakra-ui/core";
import { useQuery } from '@apollo/client';
import { getAllGeoJSONs } from '../utils/geojson'
import 'mapbox-gl/dist/mapbox-gl.css';
import { TemperatureQuery } from '../graphql/queries/TemperatureQuery';
import { useGraphQL } from '../hooks/useGraphQL';
import { Select } from "@chakra-ui/core";

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
    const [data, setData] = useState(null);
    const [years, setYears] = useState({ start: "2020", end: "2039"});
    const [scenario, setScenario] = useState("a2");
    const [loading, error, gqData] = useGraphQL(years, TemperatureQuery);
    
    // Load GeoJSON data of all countries only on startup
    useEffect( () => {
        getAllGeoJSONs().then(geojsons => {
            // setFeaturesCollection(geojsons);
            setFeaturesCollection(_addTemperatureData(geojsons, gqData));
        });
    }, [gqData]);
 

    // Update "reference" value for country colouring on scenario update
    useEffect( () => {
        console.log("Use effect on scenario update :");
        if (featuresCollection) _updateColourRefValue(featuresCollection, "temperature", "scenario", scenario)
    }, [scenario]);


    useEffect( () => {
        console.log("Use effet called");
        fetch('https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson')
            .then(response => response.json())
            .then(res => {
                // console.log(res)
                _loadData(res);
            })
            .catch(error => console.error(error))

    }, []);

    // Set the value used for country colour by looking into property 
    // and finding the element that has field attribute = filterVal
    const _updateColourRefValue = (featuresColl, property, field, filterVal) => {
        // console.log(featuresColl)
        const featuresWithRefVal = featuresColl.features.map(feature =>  {
            let prop = feature.properties[property];
            const refValue = prop ? prop.find(el => el[field] == filterVal) : 0;

            const updatedProperties = { ...feature.properties, "value": refValue };
            
          
            return { ...feature, "properties": updatedProperties }
        });

        const updatedFeaturesColl =  { ...featuresColl, "features": featuresWithRefVal};
        console.log(updatedFeaturesColl);
        setFeaturesCollection(updatedFeaturesColl);
    }

    const _addTemperatureData = (featuresColl, temperatureData) => {
        const featuresWithTemperature = featuresColl.features.map(feature =>  {
            let prop = feature.properties;
            const iso3 = prop.ISO_A3;
            const countryForecast = temperatureData ? temperatureData.forecasts.find(fc => fc.country == iso3) : null;
            
            prop = { ...prop, "temperature": countryForecast ? countryForecast.data : null };
          
            return { ...feature, "properties": prop }
        });


        console.log(featuresWithTemperature)

        return { ...featuresColl, "features": featuresWithTemperature }
    }

    const _loadData = (data) => {
        console.log(data);
        setData(_mapData(data));
    };


    const _updateColours = () => {
        console.log('Update colours called!');
        // const { data } = this.state;
        const year = Math.floor(Math.random() * 10) + 2000;
        setData(_mapData(data, year))
        console.log(_addTemperatureData(featuresCollection, gqData));
    }


    const _mapData = (data, year="2000") => {

        const { features } = data;

        const mappedFeatures = features.map(f => {
            const val = f.properties.income[year] / 60000;
            const properties = {
                ...f.properties,
                "value": val
            }

            return { ...f, properties };
        });

        return {
            'type': "FeatureCollection",
            'features': mappedFeatures
        }
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
                {/* <Button variantColor="blue" onClick={() => _updateYearsRandom()}>Update years random</Button> */}
                <Select 
                    placeholder="Select scenario" 
                    defaultValue="a2"
                    onChange={(select) => setScenario(select.target.value)}                    
                >
                    <option value="a2">a2</option>
                    <option value="b1">b1</option>
                </Select>
                <p>{gqData ? "Data" : "No data"} </p>
            </div>

        );
    }

    return Map();
}

// export const RMapGL = Map;