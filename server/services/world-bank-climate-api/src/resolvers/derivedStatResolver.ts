import { Resolver, Query, Arg} from "type-graphql";
import CountryForecast from "../entities/CountryForecast";
import { loadJson } from "../utils/loadJson";
const nodeFetch = require("node-fetch")

@Resolver()
export class DerivedStatResolver {


    @Query(() => CountryForecast)
    async hot_days(
        @Arg("iso3", () => String, { defaultValue: null, nullable: true}) iso3: string,
        @Arg("type", () => String, { defaultValue: 'annualavg'}) type: 'annualavg' | 'annualanom' ,
        @Arg("start") start: string,
        @Arg("end") end: string,
        @Arg("percentile", { defaultValue: '50'}) percentile: '10' | '50' |'90' = '50',
        @Arg("test", { defaultValue: false}) test: boolean
    ) {
        let baseUrl = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"
        let url = `${baseUrl}${type}/ensemble/${percentile}/tmax_days90th/${start}/${end}/${iso3}`;

        try {
            let data = await loadJson(url);
            data = editKeyName(data);
            return { "country": iso3, "data": data}
        } catch (err) {
            console.error(err);
            return { "country": iso3, "data": null }
        }

    }

    @Query(() => CountryForecast)
    async ppt_anom(
        @Arg("iso3", () => String, { defaultValue: null, nullable: true}) iso3: string,
        @Arg("type", () => String, { defaultValue: 'annualavg'}) type: 'annualavg' | 'annualanom' ,
        @Arg("start") start: string,
        @Arg("end") end: string,
        @Arg("percentile", { defaultValue: '50'}) percentile: '10' | '50' |'90' = '50',
    ) {
        // Histotrical average monthly precipitation (mm) for each decade since 1900s
        const historicalDailyPptUrl = `http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/pr/decade/${iso3}`;
        // Daily precipitation means anomaly prediction
        const predPptAnomUrl = `http://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualanom/ensemble/ppt_means/${start}/${end}/${iso3}`;
        try {
            let histPrecipitations: [ {"year": number, "data": number }] = await loadJson(historicalDailyPptUrl);

            const ref = 1900;
            const refDailyPpt = histPrecipitations.filter(v => v.year == ref)[0].data / 30; // Month average to day average

            let pptAnomPredictions: [ { "scenario": string, "fromYear": number, "toYear": number, "annualVal": number[], "percentile": number}] = await loadJson(predPptAnomUrl);
            // Keep absolute values and pass referece value to response -> more flexible
            pptAnomPredictions.forEach(v => { v["value"] = [v["annualVal"][0]]; });

            return { "country": iso3, "data": pptAnomPredictions, "ref" : refDailyPpt};
        } catch (err) {
            console.error(err);
            return { "country": iso3, "data": null }
        }

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
            delete fc[targetKey];
        })
    }
    // For wrong ISO codes, countryFcs is null and .forEach will raise an error. Do nothing and return v
    catch(e) { }
    finally {
        return countryFcs;
    }
}

