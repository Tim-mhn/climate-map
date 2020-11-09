import { VARIABLE_TO_UNIT } from "./constants";


export const updateFeaturesCollection = (featuresCollection, data, variable) => {
    const featuresWithPrecipitation = featuresCollection.features.map(feature =>  {
        let prop = feature.properties;
        const iso3 = prop.ISO_A3;
        const countryForecast = data ? data.alltime_forecasts.find(fc => fc.country == iso3) : null;

        prop[variable] = countryForecast ? countryForecast.data : null;
        if (countryForecast) console.log(countryForecast);
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

export const getForecastUnit = (variable, granulation) => {
    try {
        if (variable in VARIABLE_TO_UNIT) return `${VARIABLE_TO_UNIT[variable]}/${granulation}`;
        else {
            for (const variableKey of Object.keys(VARIABLE_TO_UNIT)) {
                if (variable.includes(variableKey)) return `${VARIABLE_TO_UNIT[variableKey]}/${granulation}`;
            }
            throw new Error("Could not find unit.")
        } 
    } catch (err) {
        console.error( `Error in getting forecast unit. variable=${variable}; granulation=${granulation}\
                        ${err.message}`)
        return "[ERROR Unit]"
    }
}