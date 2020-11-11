import { zip } from "./array";
import {DATA_LAYER_SCALES, VARIABLE_TO_UNIT } from "./constants";
import { anomToGross } from "./string";


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


export const getForecastUnit = (variable, granulation) => {
    try {
        const grossVariable = anomToGross(variable);
        return VARIABLE_TO_UNIT[grossVariable];
    } catch (err) {
        console.error( `Error in getting forecast unit. variable=${variable}; granulation=${granulation}\
                        ${err.message}`)
        return "[default unit]"
    }
}

export const getDataLayerStops = (input) => {
    const isAnom = input.variable.includes("Anom");
    const isRelative = input.relative;
    const grossVariable = anomToGross(input.variable);
    const colours = DATA_LAYER_SCALES[grossVariable]["colours"];

    const stopsKey = !isAnom ? "stops" : (isRelative ? "relativeAnomStops" : "anomStops");
    const stops = DATA_LAYER_SCALES[grossVariable][stopsKey];

    if (stops.length != colours.length) console.error("Stops and colours don't have same length !")

    return zip(stops, colours);
}