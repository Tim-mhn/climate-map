import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import map from '../pages/map';


export class RMapGL extends React.Component {


    state = {
        data: null,
        viewport: {
            width: 1600,
            height: 800,
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 1
        }
    }
    componentDidMount() {
        fetch(
          'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson')
          .then(response => response.json())
          .then(res => {
              console.log(res)
              this._loadData(res);
            })
          .catch(error => console.error(error))

    }

      _loadData = (data) => {
        console.log(data);
        this.setState({
          data: this.mapData(data)
        });
      };


    mapData(data) {

        const { features } = data;

        const mappedFeatures = features.map(f => {
            const val = f.properties.income["2000"] / 60000;
            const properties = {
                ...f.properties,
                "value": val
            }

            return {...f, properties};
        });

        const res = { 
            'type': "FeatureCollection",
            'features': mappedFeatures
        }
        
        return res;
    }

    _onViewportChange = viewport => this.setState({viewport});
    Map() {
        


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

        const {viewport, data} = this.state;

        return (
            <ReactMapGL
                {...viewport}
                onViewportChange={this._onViewportChange}
                // onHover={_onHover}
                mapboxApiAccessToken={TOKEN}>
                {/* <Source
                    id="oregonjson"
                    type="geojson"
                    data="https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson" />

                <Layer
                    id="oregon"
                    type="fill"
                    source="oregonjson"
                    paint={{ "fill-color": "#231b21", "fill-opacity": .4 }} />

                <Source
                    id="alaskajson"
                    type="geojson"
                    data="https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/alaska.geojson" />

                <Layer
                    id="alaska"
                    type="fill"
                    source="alaskajson"
                    paint={{ "fill-color": "#2412a3", "fill-opacity": .8 }} /> */}

                <Source type="geojson" data={data}>
                    <Layer {...dataLayer}></Layer>
                </Source>
            </ReactMapGL>
        );
    }

    render() {
        return this.Map();
    }
}

// export const RMapGL = Map;