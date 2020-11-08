import { useState } from "react";
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from "../utils/constants";

export default function ForecastMap({featuresCollection, dataLayer}) {
    const iniViewport = {
        latitude: 40,
        longitude: -100,
        zoom: 1
    }
    
    const [viewport, setViewport] = useState(iniViewport);

    
    return <ReactMapGL
        width='100vw'
        height='100vh'
        {...viewport}
        onViewportChange={(vp) => setViewport(vp)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>

        <Source type="geojson" data={featuresCollection}>
            <Layer {...dataLayer}></Layer>
        </Source>
    </ReactMapGL>
}