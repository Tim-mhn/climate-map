export interface AnnualForecast {
    "scenario": string;
    "fromYear": number;
    "toYear": number;
    "annualVal": number[];
    "percentile": number
}

export interface MonthlyForecast {
    "scenario": string;
    "fromYear": number;
    "toYear": number;
    "monthVals": number[];
    "percentile": number
}

export interface ExtendedForecast {
    "scenario": string;
    "fromYear": number;
    "toYear": number;
    "monthVals": number[];
    "annualVal": number[]
    "percentile": number
}

export interface BasicCountryRequestResponse {
    error: string;
    data: ExtendedForecast[];
}

