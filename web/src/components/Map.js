import { useState } from "react";
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from "../utils/constants";
import { camelToSentence } from "../utils/string";
import { getForecastUnit } from "../utils/features";
import MapTooltip from "./MapTooltip";
import { InputLeftAddon } from "@chakra-ui/core";

export default function ForecastMap({featuresCollection, dataLayer, input}) {
    const iniViewport = {
        latitude: 40,
        longitude: -100,
        zoom: 1
    }
    
    const [viewport, setViewport] = useState(iniViewport);
    const [hoverState, setHoverState] = useState({hoverX: null, hoverY: null,  hoverFeature: null});
    const _onHover = event => {
        const {
          features,
          srcEvent: {offsetX, offsetY}
        } = event;
        const hoverFeature = features && features.find(f => f.layer.id === 'data');
        setHoverState({ hoverFeature, hoverX: offsetX, hoverY: offsetY})
      };

      return <ReactMapGL
        width='100vw'
        height='100vh'
        {...viewport}
        onViewportChange={(vp) => setViewport(vp)}
        onHover={_onHover}
        mapboxApiAccessToken={MAPBOX_TOKEN}>

        <Source type="geojson" data={featuresCollection}>
            <Layer {...dataLayer}></Layer>
        </Source>
        <MapTooltip {...hoverState} input={input}/>
    </ReactMapGL>
}