export const camelToSentence = (variable) => {
    /** "temperatureAnom" -> "Temperature Anom" */
    return variable.replace(/[a-z]/gi, (m, o) => (m < {} && o) ? ` ${m}` : (o) ? m : m.toUpperCase())
}

// 'temperature' -> 'temperatureAnom'
export const grossToAnom = (variableName) => `${variableName}Anom`;
// 'temperatureAnom' -> 'temperature'
export const anomToGross = (anomVariableName) => anomVariableName.replace('Anom', '');

export const isInputVariableAnom = (input) => input.variable.includes('Anom');
