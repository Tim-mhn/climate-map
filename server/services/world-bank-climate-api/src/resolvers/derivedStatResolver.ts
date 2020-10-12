import { Resolver, Query, Arg} from "type-graphql";
import CountryForecast from "../entities/CountryForecast";
// const countrycodes = require('../help/countryCodes.json')
const nodeFetch = require("node-fetch")

@Resolver()
export class DerivedStatResolver {


    @Query(() => [CountryForecast])
    async hot_days(
        @Arg("iso3", () => String, { defaultValue: null, nullable: true}) iso3: string[],
        @Arg("type", () => String, { defaultValue: 'annualavg'}) type: 'annualavg' | 'annualanom' ,
        @Arg("start") start: string,
        @Arg("end") end: string,
        @Arg("percentile", { defaultValue: '50'}) percentile: '10' | '50' |'90' = '50',
        @Arg("test", { defaultValue: false}) test: boolean
    ) {
        let baseUrl = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"
        let url = `${baseUrl}${type}/ensemble/${percentile}/tmax_days90th/${start}/${end}/${iso3}`;

        return nodeFetch(url)
            .then((res: any) => {
                console.log("before res json");
                console.log(res.json());
                console.log("after res json");
                return res.json();
            })
            .then((body: any[]) => {
                console.log("before edit key name");
                // body = body.map(fc => editKeyName(fc));
                console.log("after edit key name");
                console.log(body);
                return body;
            })
            .catch((err: Error) => {
                console.error(`Error when fetching from ${url}: ${err}`);
                return null;
        })


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

