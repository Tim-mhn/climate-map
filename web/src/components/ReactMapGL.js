import React, { useEffect, useState} from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { Button } from "@chakra-ui/core";
import { useQuery } from '@apollo/client';
import { getAllGeoJSONs } from '../utils/geojson'
import 'mapbox-gl/dist/mapbox-gl.css';
import map from '../pages/map';
import { TemperatureQuery } from '../graphql/queries/TemperatureQuery';
import { useGraphQL } from '../hooks/useGraphQL';


export const RMapGL = () => {

    const vp = {
            width: 1600,
            height: 800,
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 1
        }

    const [viewport, setViewport] = useState(vp);
    const [data, setData] = useState(null);
    const [years, setYears] = useState({ start: "2020", end: "2039"});
    const [queryResp, setQueryResp] = useState(<p>Loading</p>)
    const queryRes = useGraphQL(years, TemperatureQuery);

    // const { gqLoading, gqError, gqData } = useQuery(
    //     TemperatureQuery, 
    //     { variables: { ...years }});


    // useEffect( () => {


    //     console.log("Use Effect for GRAPHQL called")
    //     setQueryResp(() => {
    //         console.log(gqLoading, gqError, gqData )
    //         if (gqError) return <p>Error :/</p>
    //         if (!gqLoading && gqData) return <p>Success, query has been called !</p>
    //         return <p>Loading</p>
    //     });

    // }, [gqLoading, gqError, gqData]);

 

    useEffect( () => {
        // this.loadTemperatureData();
        console.log("Use effet called");
        fetch('https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson')
            .then(response => response.json())
            .then(res => {
                console.log(res)
                _loadData(res);
            })
            .catch(error => console.error(error))

    }, []);

    // const _loadTemperatureData = () => {
    //     const start = "2020";
    //     const end = "2039";
    //     const { loading, error, data } = useQuery(TemperatureQuery,
    //     { variables: { start, end }
    //     });

    //     if (data) console.log(data);
    //     else if(loading) console.info("loading")
    //     else console.error(error)

    //     getAllGeoJSONs().then(geojson => console.log(geojson));
    // }

    // _loadTemperatureData();

    const _loadData = (data) => {
        console.log(data);
        setData(_mapData(data));
    };


    const _updateColours = () => {
        console.log('Update colours called!');
        // const { data } = this.state;
        const year = Math.floor(Math.random() * 10) + 2000;
        getAllGeoJSONs().then(geojson => console.log(geojson));
        setData(_mapData(data, year))
    }

    const _updateYearsRandom = () => {
        const early = Math.random() > 0.5;
        console.log("update years random called");
        setYears({start: early ? "2020" : "2040", end: early ? "2039" : "2059"});
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

        const res = {
            'type': "FeatureCollection",
            'features': mappedFeatures
        }
        // console.log(`_mapData called with`);
        // console.log(res);
        return res;
    }



    // _onViewportChange = viewport => setState({ viewport });
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
                        [0.1, '#66c2a5'],
                        [.2, '#abdda4'],
                        [.3, '#e6f598'],
                        [.4, '#ffffbf'],
                        [.5, '#fee08b'],
                        [.6, '#fdae61'],
                        [.7, '#f46d43'],
                        [.8, '#d53e4f']
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

                    <Source type="geojson" data={data}>
                        <Layer {...dataLayer}></Layer>
                    </Source>
                </ReactMapGL>
                <Button variantColor="green" onClick={() => _updateColours()}>Update colours</Button>
                <Button variantColor="blue" onClick={() => _updateYearsRandom()}>Update years random</Button>
                { queryResp }
            </div>

        );
    }

    return Map();
}

// export const RMapGL = Map;