import { useMemo, useState } from "react";
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from "../utils/constants";
import { camelToSentence } from "../utils/string";
import { getForecastUnit } from "../utils/features";
import MapTooltip from "./MapTooltip";
import { InputLeftAddon } from "@chakra-ui/core";
import theme from "../theme";
import { DataDrawer } from "./DataDrawer";

const noDataLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    "fill-color": '#434123'
  }
};
export default function ForecastMap({ featuresCollection, dataLayer, input }) {
  const iniViewport = {
    latitude: 40,
    longitude: -100,
    zoom: 1
  }

  const [viewport, setViewport] = useState(iniViewport);
  const [hoverState, setHoverState] = useState({ hoverX: null, hoverY: null, hoverFeature: null });
  const [clickedFeature, setClickedFeature]  = useState(null);

  const _onHover = event => {
    const {
      features,
      srcEvent: { offsetX, offsetY }
    } = event;
    const hoverFeature = features && features.find(f => ['data', 'no-data'].includes(f.layer.id));
    setHoverState({ hoverFeature, hoverX: offsetX, hoverY: offsetY })
  };

  const _onClick = event => {
    console.info(event)
    const { features } = event;
    console.info(features)
    const _clickedFeature = features && features.find(f => f.layer.id == 'data');
    setClickedFeature(_clickedFeature)
  }

  // Update filter used to find current hovered area (and highlight it)
  const _hoverHighlightFilter = useMemo(() => (['==', 'ISO_A3', hoverState.hoverFeature ? hoverState.hoverFeature.properties.ISO_A3 : '']), [hoverState]);

  // Split between countries with and without data
  const _featuresWithData = featuresCollection.features.filter(feature => feature.properties.value);
  const _featuresWithoutData = featuresCollection.features.filter(feature => !feature.properties.value);

  const _featuresCollWithData = { ...featuresCollection, features: _featuresWithData };
  const _featuresCollWithoutData = { ...featuresCollection, features: _featuresWithoutData };

  return <ReactMapGL
    width='100vw'
    height='100vh'
    {...viewport}
    onViewportChange={(vp) => setViewport(vp)}
    onHover={_onHover}
    onClick={e => {_onClick(e)}}
    mapboxApiAccessToken={MAPBOX_TOKEN}>

    {/* Countries with available data -> painted depending on input */}
    <Source type="geojson" data={_featuresCollWithData}>
      <Layer {...dataLayer}></Layer>
    </Source>

    {/* Countries with NO available data -> light gray paint */}
    <Source type="geojson" data={_featuresCollWithoutData}>
      <Layer id="no-data" type="fill" paint={{ 'fill-color': theme.noDataFillColour }}></Layer>
    </Source>

    {/* Hovered country -> highlight */}
    <Source type="geojson" data={featuresCollection}>
      <Layer id="hover-highlight" type="fill" paint={{ 'fill-color': 'white', 'fill-opacity': 0.25 }} filter={_hoverHighlightFilter}></Layer>
    </Source>

    {/* Hovered country -> overlay a Tooltip for country */}
    <MapTooltip {...hoverState} input={input} />
    <DataDrawer featuresCollection={featuresCollection} clickedFeature={clickedFeature} input={input}/>

  </ReactMapGL>
}