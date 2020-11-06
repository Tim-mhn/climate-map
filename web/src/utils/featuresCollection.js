

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



const _getForecastFromProp = (property, input) => {
    if (!property) return null;

    const matchingKeys = ["scenario", "fromYear"];
    // Found forecast with matching scenario, percentile and period
    return property.find(el => matchingKeys.every(key => el[key] == input[key]));

}

export const getForecastValueFromProp = (property, input) => {
    // Return either a month or year value with refKey. yearValue is a 1-element array / monthValues is a 12-element array
    
    const forecast = _getForecastFromProp(property, input);

    const idx = input.granulation == "year" ? 0 : input.month;
    const refKey = input.granulation == "year" ? "annualVal" : "monthVals"
    return forecast ? forecast[refKey][idx] : null;
}

// 'temperature' -> 'temperatureAnom'
export const grossToAnom = (variableName) => `${variableName}Anom`;
// 'temperatureAnom' -> 'temperature'
export const anomToGross = (anomVariableName) => anomVariableName.replace('Anom', '');

export const isInputVariableAnom = (input) => input.variable.includes('Anom');