import { Resolver, Query, Arg} from "type-graphql";
import { CountryBaseForecast } from "../entities/CountryForecast";
import { getIsoCodes } from '../utils/isoCodes'
const nodeFetch = require("node-fetch")

@Resolver()
export class AverageForecastResolver {


    @Query(() => String)
    async hello() {
        return "hello world";
    }
    
    @Query(() => [CountryBaseForecast])
    async forecasts(
        @Arg("iso3", () => [String], { defaultValue: null, nullable: true}) iso3: string[],
        @Arg("variable", () => String) variable: 'tas' | 'pr',
        @Arg("type", () => String, { defaultValue: 'annualavg'}) type: 'annualavg' | 'annualanom' ,
        @Arg("start") start: string,
        @Arg("end") end: string,
        @Arg("percentile", { defaultValue: '50'}) percentile: '10' | '50' |'90' = '50',
        @Arg("test", { defaultValue: false}) test: boolean
    ) {
        let baseUrl = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"
        let url = `${baseUrl}${type}/ensemble/${percentile}/${variable}/${start}/${end}/`;

        // Get all codes if iso3 is null
        let countryCodes: string[] = iso3 ? (toArray(iso3)) : await getIsoCodes();

        // Reduce query time when developing
        if (test) countryCodes = countryCodes.slice(0, 5);

        let countryPromises: Promise<any>[] = countryCodes.map((code: string) => createCountryPromise(url, code));

        return Promise.all(countryPromises)
            .then((finalVals: any) => {

                finalVals = finalVals.map((countryFcs: any, idx: number) => {
                    countryFcs = editKeyName(countryFcs);
                    return {"country": countryCodes[idx],  "data": countryFcs, "type": type, "variable": variable}
                });

                return finalVals;
            });

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

function createCountryPromise(url: string, code: string) {
    /**
     *  Create a promise for each country to handle bad requests (like for Antarticta) and return null in that case
     *  Inputs: base url and iso3 country code
     */
    return nodeFetch(`${url}${code}`)
        .then((res: any) => res.json())
        .catch((err: Error) => {
            console.error(`Error when fetching from ${url}${code}`);
            return null;
        })
}


function toArray(obj: any) {
    /**
     * Return obj if obj is array otherwise [obj]
     */
    return (typeof(obj) === typeof(["hello"])) ? obj : [obj];
}
