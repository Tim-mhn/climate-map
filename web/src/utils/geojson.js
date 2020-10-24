const { default: map } = require("../pages/map");

async function getAllGeoJSONs() {
    const geoJsonURL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    
    const data = await fetch(geoJsonURL)
      .then(r => r.json())
      .then(json => {
          console.log(json);
          return json;
      })
      .then(json => mapData(json))
      .catch(err => {
          console.error(err);
          return { "data": null, "error": err};
      });

    return data;
}


function mapData(data) {
    data.map()
}
