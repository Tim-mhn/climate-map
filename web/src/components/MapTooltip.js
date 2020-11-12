import {  formatValue, prettyVariable } from "../utils/string";


export default function MapTooltip({hoverFeature, hoverX, hoverY, input}) {

    if (!hoverFeature) return null;

    let content;
    if(hoverFeature.properties.value && hoverFeature.properties.value != "null") {
        const val = hoverFeature.properties.value.toFixed(1);
        content = `${prettyVariable(input.variable)} ${formatValue(input, val)}`;
    } else { content = "No data for this country" }
        
    return <div className="tooltip" style={{position: 'absolute', left: hoverX+15, top: hoverY+15}}>
            <div className="tooltip-header">{ hoverFeature.properties ? hoverFeature.properties.ADMIN : 'no country'}</div>
            <div> {  content } </div>
          </div>
        
}