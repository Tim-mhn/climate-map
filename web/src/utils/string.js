import { getForecastUnit } from "./features";

export const camelToSentence = (variable) => {
    /** "temperatureAnom" -> "Temperature Anom" */
    return variable.replace(/[a-z]/gi, (m, o) => (m < {} && o) ? ` ${m}` : (o) ? m : m.toUpperCase())
}

export const prettyVariable = (variable) => camelToSentence(variable).replace('Anom', 'Anomaly');

// 'temperature' -> 'temperatureAnom'
export const grossToAnom = (variableName) => `${variableName}Anom`;
// 'temperatureAnom' -> 'temperature'
export const anomToGross = (anomVariableName) => anomVariableName.replace('Anom', '');

export const isAnomVariable = (variable) => variable.includes('Anom');

export const formatValue = (input, value) => {
    const isAnomaly = isAnomVariable(input.variable);
    const unit = (input.relative && isAnomaly) ? '%' : getForecastUnit(input.variable, input.granulation);
    const sign = value >= 0 ? '+' : '';
    return `${isAnomaly ? sign : ''} ${value} ${unit}`;
}

