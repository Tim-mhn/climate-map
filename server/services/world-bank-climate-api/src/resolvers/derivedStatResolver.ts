import { Resolver, Query, Arg} from "type-graphql";
import { CountryBaseForecast, CountryPrecipitationForecast } from "../entities/CountryForecast";
import { AnnualForecast, ExtendedForecast, MonthlyForecast } from "../models/interfaces";
import { addAnnualVals, getMonthAnnualVal } from "../utils/forecast";
import { createCountryPromise, loadJson } from "../utils/promises";
const nodeFetch = require("node-fetch")

@Resolver()
export class DerivedStatResolver {


    @Query(() => CountryBaseForecast)
    async hot_days(
        @Arg("iso3", () => String, { defaultValue: null, nullable: true}) iso3: string,
        @Arg("type", () => String, { defaultValue: 'mavg'}) type: 'annualavg' | 'mavg' ,
        @Arg("start") start: string,
        @Arg("end") end: string,
        @Arg("percentile", { defaultValue: '50'}) percentile: '10' | '50' |'90' = '50',
        @Arg("test", { defaultValue: false}) test: boolean
    ) {
        let baseUrl = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"
        let url = `${baseUrl}mavg/ensemble/${percentile}/tmax_days90th/${start}/${end}/`;

        let hotDaysPromise = createCountryPromise(url, iso3);

        return hotDaysPromise.then(res => {
            return { 
                "country": iso3, 
                "data": res.data, 
                "error": res.error
            }
        });

    }

    @Query(() => CountryPrecipitationForecast)
    async daily_ppt_forecasts(
        @Arg("iso3", () => String, { defaultValue: null, nullable: true}) iso3: string,
        @Arg("granulation", () => String, { defaultValue: 'year'}) granulation: 'year' | 'month' ,
    ) {

        let requestType = granulation == "year" ? "annual" : "m";
        const anom = requestType + "anom";
        const avg = requestType + "avg";
        // Precipitation Prediction urls (for year or month depending on granulation)
        const pptPredUrl = (type: string, start: string, end: string) => `http://climatedataapi.worldbank.org/climateweb/rest/v1/country/${type}/ensemble/ppt_means/${start}/${end}/${iso3}`;

        // Only time periods avaiable from API
        const timePeriods = [ { "start" : "2046", "end": "2065"}, { "start" : "2081", "end": "2100"}]


        let forecasts: any[] = [];
        for (let yearPair of timePeriods) {
            try {
                let averageFcs: [AnnualForecast | MonthlyForecast] = await loadJson(pptPredUrl(avg, yearPair.start, yearPair.end));
                let annomalyFcs: [AnnualForecast | MonthlyForecast] = await loadJson(pptPredUrl(anom, yearPair.start, yearPair.end));

                averageFcs.forEach(v => { v["avg"] = getMonthAnnualVal(v)} );

                // Add anomaly prediction to each corresponding average forecast element (same percentile, scenario)
                annomalyFcs.forEach(anomFc => {
                    // Find matching element in average forecasts
                    let matchingAvgForecast: any = averageFcs.find(fc => fc.percentile == anomFc.percentile && fc.scenario == anomFc.scenario);
                    // Add anomaly predictions
                    matchingAvgForecast["anom"] = getMonthAnnualVal(anomFc);
                });

                forecasts = forecasts.concat(averageFcs);

            } catch (err) {
                console.error(err);
                forecasts.push({"fromYear": yearPair.start, "toYear": yearPair.end, "avg": null, "anom": null, "percentile": null, "error" : err.message});
            }
        }

        // True if all requests have generated an error
        const globalError = forecasts.every(fc => "error" in fc);

        const response: CountryPrecipitationForecast = { "country" : iso3, "data": forecasts, "error": globalError ? forecasts[0]["error"] : undefined };
        return response
    }




}

function editKeyName(countryFcs: any[]) {
    /**
     * Move 'monthVals' or 'annualVal' data into a 'value' key
     */
    try {
        // Change key name for each forecast per scenario
        countryFcs.forEach((fc: any) => {
            const targetKey = Object.keys(fc).includes("monthVals") ? "monthVals" : "annualVal";
            fc["value"] = fc[targetKey];
            // delete fc[targetKey];
        })
    }
    // For wrong ISO codes, countryFcs is null and .forEach will raise an error. Do nothing and return v
    catch(e) { }
    finally {
        return countryFcs;
    }
}

