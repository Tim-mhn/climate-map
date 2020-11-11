import { getForecastUnit } from "../utils/features";
import { camelToSentence } from "../utils/string";


export default function MapTooltip({hoverFeature, hoverX, hoverY, input}) {

    if (!hoverFeature) return null;

    let content;
    if(hoverFeature.properties.value && hoverFeature.properties.value != "null") {
        const variable = camelToSentence(input.variable);
        const val = hoverFeature.properties.value.toFixed(2);
        const unit = getForecastUnit(input.variable, input.granulation);
        content = `${variable}: ${val} ${unit}`
    } else { content = "No data for this country" }
        
    return <div className="tooltip" style={{position: 'absolute', left: hoverX+15, top: hoverY+15}}>
            <div className="tooltip-header">{ hoverFeature.properties ? hoverFeature.properties.ADMIN : 'no country'}</div>
            <div> {  content } </div>
          </div>
        
}