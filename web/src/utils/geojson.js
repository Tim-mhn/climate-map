import { useQuery } from '@apollo/client';
import { TemperatureQuery } from '../graphql/queries/TemperatureQuery';

export async function getAllGeoJSONs() {
    const geoJsonURL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    
    const data = await fetch(geoJsonURL)
      .then(r => r.json())
      .then(json => {
          console.log(json);
          return json;
      })
      .then(json => _mapData(json))
      .catch(err => {
          console.error(err);
          return { "data": null, "error": err};
      });

    return data;
}


function _mapData(data) {
    return data;
}

