import { linearScale } from "./array";

// Time periods allowed for start, end dates in climate API basic requests
export const BASIC_REQ_TIME_PERIODS = {
    "2020": "2039",
    "2040": "2059",
    "2060": "2079",
    "2080": "2099"
};

export const MONTHS = [
    "Jan", "Feb", "Mar", "Ap", "May", "Jun",
    "Jul", "Au", "Sep", "Oc", "Nov", "Dec"
];

// Time periods allowed for start, end dates in climate API ensembled derived statistics requests
export const DERIVED_REQ_TIME_PERIODS = {
    "2046": "2065",
    "2081": "2100"
}


const STOPS_COUNT = 10;
export const hex2rgba = (hex, a=.7) => {
    // "use strict";
    if (hex.charAt(0) === '#') {
        hex = hex.substr(1);
    }
    if ((hex.length < 2) || (hex.length > 6)) {
        return false;
    }
    var values = hex.split(''),
        r,
        g,
        b;

    if (hex.length === 2) {
        r = parseInt(values[0].toString() + values[1].toString(), 16);
        g = r;
        b = r;
    } else if (hex.length === 3) {
        r = parseInt(values[0].toString() + values[0].toString(), 16);
        g = parseInt(values[1].toString() + values[1].toString(), 16);
        b = parseInt(values[2].toString() + values[2].toString(), 16);
    } else if (hex.length === 6) {
        r = parseInt(values[0].toString() + values[1].toString(), 16);
        g = parseInt(values[2].toString() + values[3].toString(), 16);
        b = parseInt(values[4].toString() + values[5].toString(), 16);
    } else {
        return false;
    }
    return `rgba(${r},${g},${b},${a})`;
}


export const DATA_LAYER_SCALES = {
    "temperature": {
        "colours": ["rgba(141,141, 141, 0.7)", "rgba(186,119, 215, 0.7)", "rgba(162,15, 226, 0.7)", "rgba(0,4, 206, 0.7)", 
                    "rgba(0,202, 216, 0.7)", "rgba(18,189, 43, 0.7)", "rgba(227,219, 0, 0.7)", "rgba(222,139, 0, 0.7)", 
                    "rgba(199,60, 0, 0.7)", "rgba(70,11, 10, 0.7)"],
        "stops": linearScale(-5, 30, STOPS_COUNT),
        "anomStops": linearScale(-3, 6, STOPS_COUNT),
        "relativeAnomStops": linearScale(-60, 61, STOPS_COUNT)
    },
    "precipitation": {
        "colours": ["rgba(103,0, 31, 0.7)", "rgba(178,23, 43, 0.7)", "rgba(214,96, 77, 0.7)", "rgba(253,219, 199, 0.7)", 
                    "rgba(248,248, 248, 0.7)", "rgba(209,229, 240, 0.7)", "rgba(146,197, 223, 0.7)", 
                    "rgba(67,147, 195, 0.7)", "rgba(33,102, 172, 0.7)", "rgba(5,48, 97, 0.7)"] ,
        "stops": linearScale(10, 300, STOPS_COUNT),
        "anomStops": linearScale(-20, 30, STOPS_COUNT),
        "relativeAnomStops":linearScale(-.3, .3, STOPS_COUNT, false)
    },
    "default": {
        "colours": ["#00FF7F", "#27dc54", "#3BCA6D", "#77945C", 
                    "#818a77", "#B25F4A", "#ED2938", "#ed1524", 
                    "#f70110", "#ff0000"],
        "stops": linearScale(0, 100, STOPS_COUNT),
        "anomStops": ["#00FF7F", "#27dc54", "#3BCA6D", "#77945C", 
                    "#818a77", "#B25F4A", "#ED2938", "#ed1524", 
                    "#f70110", "#ff0000"],
        "relativeAnomStops": ["#00FF7F", "#27dc54", "#3BCA6D", "#77945C", 
                            "#818a77", "#B25F4A", "#ED2938", "#ed1524", 
                            "#f70110", "#ff0000"]
    }
}

export const MAPBOX_TOKEN = "pk.eyJ1IjoidGltaG4iLCJhIjoiY2tnbW1pZ2czMDVwYTJ1cXBkZzJjcXMxaCJ9.UNBlavlP3hhSmT5f7DRdBA";

export const VARIABLE_TO_UNIT = {
    "temperature": "°C",
    "precipitation": "mm/month"
}

export const INPUT_TO_TOOLTIP = {
    "variable": [
        "Pick between temperature and precipitation forecasts.",
        "Anomalies are changes compared to the 1961-199 period"
    ],
    "scenario": [
        "Scenarios are used to make projections of future climate change. \
        They depend on many parameters such as energy transition, political and environmental actions, \
        social shift and scientific progress.",

        <span><b>A2 "Business as usual"</b>
            <ul>
                <li>Continuously increasing population</li>
                <li>High emissions</li>
                <li>Important economic development</li>
            </ul></span>,
        <span><b>B1 "A more environmental friendly society"</b>
            <ul>
                <li>Population decline after 2050</li>
                <li>Resource efficient technologies</li>
                <li>Emphasis on environmental actions</li>
            </ul></span>,

        "The scenarios are from the SRES (Special Report on Emissions Scenarios).",
    ],
    "granulation": ["Year or month average value"],
}
