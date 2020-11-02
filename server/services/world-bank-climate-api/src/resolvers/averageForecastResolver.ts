import { Resolver, Query, Arg} from "type-graphql";
import { CountryBaseForecast } from "../entities/CountryForecast";
import { getIsoCodes } from '../utils/isoCodes';
import { BASIC_REQ_TIME_PERIODS } from '../utils/constants';
import { MonthlyForecast } from "../models/interfaces";
import { addAnnualVals } from '../utils/forecast';


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
        if (test) countryCodes = countryCodes.slice(1, 10);


        let countryPromises: Promise<any>[] = countryCodes.map((code: string) => createCountryPromise(url, code));

        return Promise.all(countryPromises)
            .then((finalVals: any) => {

                finalVals = finalVals.map((countryFcs: any, idx: number) => {
                    const success = typeof(countryFcs) != typeof("string");
                    const errorMsg = success ? null : countryFcs;


                    return {
                        "country": countryCodes[idx],  
                        "data": countryFcs, 
                        "type": type, 
                        "variable": variable,
                        "error" : errorMsg
                    }
                });

                return finalVals;
            });

    }

    @Query(() => [CountryBaseForecast])
    async alltime_forecasts(
        @Arg("iso3", () => [String], { defaultValue: null, nullable: true}) iso3: string[],
        @Arg("variable", () => String) variable: 'tas' | 'pr',
        @Arg("type", () => String, { defaultValue: 'mavg'}) type: 'annualavg' | 'annualanom' ,
        @Arg("percentile", { defaultValue: '50'}) percentile: '10' | '50' |'90' = '50',
        @Arg("test", { defaultValue: false}) test: boolean
    ) {
        let baseUrl = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"
        let url = `${baseUrl}${type}/ensemble/${percentile}/${variable}/`;
        console.count(`All time forecasts called ! with args: ${iso3} ${variable} ${percentile} ${type}`)

        // Get all codes if iso3 is null
        let countryCodes: string[] = iso3 ? (toArray(iso3)) : await getIsoCodes();

        // Reduce query time when developing
        if (test) countryCodes = countryCodes.slice(1, 10);

        let countryPromises: Promise<any[]>[] = countryCodes.map((code: string) => createAlltimeCountryPromise(url, code));

        return Promise.all(countryPromises)
            .then((finalVals: any) => {
                finalVals = finalVals.map((countryFcs: any, idx: number) => {
                    const success = typeof(countryFcs) != typeof("string");
                    const errorMsg = success ? null : countryFcs;
                    return {"country": countryCodes[idx],  "data": countryFcs, "type": type, "variable": variable, "error": errorMsg}
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
        .then((res: MonthlyForecast[])  => addAnnualVals(res))
        .catch((err: Error) => {
            const errorMsg = `Error when fetching from ${url}${code}. Details: ${err.message}`;
            console.error(errorMsg);
            return errorMsg ;
        })
}

function createAlltimeCountryPromise(url: string, code: string): Promise<any[]  > {
    /**
     *  Create a promise for each country to handle bad requests (like for Antarticta) and return null in that case
     *  Inputs: base url and iso3 country code
     */

    const countryAlltimePromises: Promise<any>[] = BASIC_REQ_TIME_PERIODS.map(([start, end]: string[]) => {
        let startEndUrl = `${url}${start}/${end}/`;
        return createCountryPromise(startEndUrl, code)
    })

    return Promise.all(countryAlltimePromises)
        .then((countryAlltimeRes: any[][]) => {
            // if (countryAlltimeRes.every(res => res instanceof String)) return null
            const successfulRes = countryAlltimeRes.filter(res => typeof(res) != "string");
            if (successfulRes.length > 0) return _flatten(successfulRes);
            const firstErrorMsg = countryAlltimeRes[0];

            return firstErrorMsg;
        })
        .catch((error) => {
            console.error(`Erorr on create all time country promises ${error}`);
            return [];
        })

    
}

function _flatten(nestedArr: any[][]) {
    return nestedArr.reduce((prev, curr) => prev.concat(curr), []);
}


function toArray(obj: any) {
    /**
     * Return obj if obj is array otherwise [obj]
     */
    return (typeof(obj) === typeof(["hello"])) ? obj : [obj];
}
