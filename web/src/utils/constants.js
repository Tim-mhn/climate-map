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

export const DATA_LAYER_SCALES = {
    "temperature": {
        "colours": ["#8D8D8D", "#BA77D7", "#A20FE2", 
                    "#0004CE", "#00CAD8", "#12BD2B", "#E3DB00", 
                    "#DE8B00", "#C73C00", "#460B0A"],
        "stops": linearScale(-5, 30, STOPS_COUNT),
        "anomStops": linearScale(-3, 6, STOPS_COUNT),
        "relativeAnomStops": linearScale(-60, 60, STOPS_COUNT)
    },
    "precipitation": {
        "colours": ["#67001F", "#B2172B", "#D6604D", "#FDDBC7", 
                    "#F8F8F8", "#D1E5F0", "#92C5DF", "#4393C3", 
                    "#2166AC", "#053061"],
        "stops": linearScale(0, 350, STOPS_COUNT),
        "anomStops": linearScale(-20, 30, STOPS_COUNT),
        "relativeAnomStops":linearScale(-.3, .3, STOPS_COUNT, false)
    },
    "default": {
        "colours": ["#00FF7F", "#27dc54", "#3BCA6D", "#77945C", 
                    "#818a77", "#B25F4A", "#ED2938", "#ed1524", 
                    "#f70110", "#ff0000"],
        "stops": [],
        "anomStops": [],
        "relativeAnomStops": []
    }
}

export const MAPBOX_TOKEN = "pk.eyJ1IjoidGltaG4iLCJhIjoiY2tnbW1pZ2czMDVwYTJ1cXBkZzJjcXMxaCJ9.UNBlavlP3hhSmT5f7DRdBA";

export const VARIABLE_TO_UNIT = {
    "temperature": "°C",
    "precipitation": "mm/month"
}

export const INPUT_TO_TOOLTIP = {
    "variable": "Pick between temperature and precipitation forecast. Anomalies are compared to 1961-199 period",
    "scenario": "Economic and environment scenarios from the SRES (Special Report on Emissions Scenarios). A2 is characterized by continually increasing population, high emissions. B1 is characterized by population peak in 2050, rapid economic growth but emphasis on environmental solutions.",
    "granulation": "granulation tooltip",
}
