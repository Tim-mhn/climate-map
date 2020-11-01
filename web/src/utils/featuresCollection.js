

export const updateFeaturesCollection = (featuresCollection, data, variable) => {
    const featuresWithPrecipitation = featuresCollection.features.map(feature =>  {
        let prop = feature.properties;
        const iso3 = prop.ISO_A3;
        const countryForecast = data ? data.alltime_forecasts.find(fc => fc.country == iso3) : null;

        prop[variable] = countryForecast ? countryForecast.data : null;
      
        return { ...feature, "properties": prop }
    });


    return { ...featuresCollection, "features": featuresWithPrecipitation };
}