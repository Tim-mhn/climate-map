
export async function getAllGeoJSONs() {
    const geoJsonURL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    const data = await fetch(geoJsonURL)
      .then(r => r.json())
      .then(json => {
          return json;
      })
      .catch(err => {
          console.error(err);
          return { "data": null, "error": err};
      });
    return data;
}


