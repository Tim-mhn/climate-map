

export const updateFeaturesCollection = (featuresCollection, data, variable) => {
    console.count("Update features collection called");
    const featuresWithPrecipitation = featuresCollection.features.map(feature =>  {
        let prop = feature.properties;
        const iso3 = prop.ISO_A3;
        const countryForecast = data ? data.forecasts.find(fc => fc.country == iso3) : null;

        prop[variable] = countryForecast ? countryForecast.data : null;
      
        return { ...feature, "properties": prop }
    });


    console.log(featuresWithPrecipitation)

    return { ...featuresCollection, "features": featuresWithPrecipitation };
}