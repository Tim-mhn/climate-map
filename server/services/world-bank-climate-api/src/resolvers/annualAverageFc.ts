import { Resolver, Query, Arg} from "type-graphql";
import AnnualAverageForecast from "../entities/AnnualAverageForecast";
import CountryForecast from "../entities/CountryForecast";
const countrycodes = require('../help/countryCodes.json')
const nodeFetch = require("node-fetch")

@Resolver()
export class AnnualAverageForecastResolver {


    @Query(() => [CountryForecast])
    async forecasts(
        @Arg("iso3") iso3: string,
        @Arg("variable", () => String) variable: 'tas' | 'pr',
        @Arg("type", () => String, { defaultValue: 'annualavg'}) type: 'annualavg' | 'annualanom' ,
        @Arg("start") start: string,
        @Arg("end") end: string,
        @Arg("percentile", { defaultValue: '50'}) percentile: '10' | '50' |'90' = '50',
    ) {
        let baseUrl = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"
        let url = `${baseUrl}${type}/ensemble/${percentile}/${variable}/${start}/${end}/`;

        let countryCodes = await getCountryISOCodes();

        let promises = countryCodes.map((code: string) => createCountryPromise(url, code));
        return Promise.all(promises)
            .then((finalVals: any) => {

                finalVals = finalVals.map((v: any, idx: number) => {
                    return {"country": countryCodes[idx],  "value": v}
                });

                return finalVals;
            });

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
async function getCountryISOCodes() {
    var codes = countrycodes.map((c: any) => c['iso3']);
    // return codes.slice(0, 50);
    return codes;
}

