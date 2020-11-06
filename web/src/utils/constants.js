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

export const DATA_LAYER_STOPS = {
    "temperature": [-2, -1, 3, 6, 9, 13, 17, 21, 25, 29],
    "precipitation": [300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000],
    "default": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
};
export const DATA_LAYER_COLOURS = ["#00FF7F", "#27dc54", "#3BCA6D", "#77945C", "#818a77", "#B25F4A", "#ED2938", "#ed1524", "#f70110", "#ff0000"];

export const MAPBOX_TOKEN = "pk.eyJ1IjoidGltaG4iLCJhIjoiY2tnbW1pZ2czMDVwYTJ1cXBkZzJjcXMxaCJ9.UNBlavlP3hhSmT5f7DRdBA";

