import { Resolver, Query, Arg} from "type-graphql";
import { CountryBaseForecast } from "../entities/CountryForecast";
import { getIsoCodes } from '../utils/isoCodes';
import { BASIC_REQ_TIME_PERIODS } from '../utils/constants';
import { BasicCountryRequestResponse, ExtendedForecast, MonthlyForecast } from "../models/interfaces";
import { arrayFlatten } from "../utils/array";
import { createCountryPromise } from "../utils/promises";


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
                        "error" : errorMsg,
                    }
                });

                return finalVals;
            });

    }

    @Query(() => [CountryBaseForecast])
    async alltime_forecasts(
        @Arg("iso3", () => [String], { defaultValue: null, nullable: true}) iso3: string[],
        @Arg("variable", () => String) variable: 'tas' | 'pr',
        @Arg("type", () => String, { defaultValue: 'avg'}) type: 'avg' | 'anom' ,
        @Arg("percentile", { defaultValue: '50'}) percentile: '10' | '50' |'90' = '50',
        @Arg("test", { defaultValue: false}) test: boolean
    ) {
        console.debug(`Calling alltime_forecasts with args: ${iso3} ${variable} ${percentile} ${type}`)
        let baseUrl = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/"
        const apiType = "m"+type; // manom or mavg
        let url = `${baseUrl}${apiType}/ensemble/${percentile}/${variable}/`;

        // Get all codes if iso3 is null
        let countryCodes: string[] = iso3 ? (toArray(iso3)) : await getIsoCodes();

        // Reduce query time when developing
        if (test) countryCodes = countryCodes.slice(1, 10);

        let countryPromises = countryCodes.map((code: string) => createAlltimeCountryPromise(url, code));

        return Promise.all(countryPromises)
            .then((finalVals: any) => {
                finalVals = finalVals.map((countryFcs: any, idx: number) => {
                    const success = typeof(countryFcs) != typeof("string");
                    return {
                        "country": countryCodes[idx],  
                        "data": success ? countryFcs : null, 
                        "type": type, 
                        "variable": variable, 
                        "error": success ? null : countryFcs,
                        // "unit": unit
                    }
                });

                return finalVals;
            });

    }



}






function createAlltimeCountryPromise(url: string, code: string): Promise<string | ExtendedForecast[] > {
    /**
     *  Create a promise for each country to handle bad requests (like for Antarticta) and return null in that case
     *  Inputs: base url and iso3 country code
     */

    const countryAlltimePromises = BASIC_REQ_TIME_PERIODS.map(([start, end]: string[]) => {
        let startEndUrl = `${url}${start}/${end}/`;
        return createCountryPromise(startEndUrl, code)
    })

    return Promise.all(countryAlltimePromises)
        .then((countryAlltimeRes: BasicCountryRequestResponse[]) => {
            // Keep only succesful queries responses
            const successfulRes = countryAlltimeRes.filter(res => res.data);
            // If some queries have worked, return the flattened array of forecasts (res.data)
            if (successfulRes.length > 0) return arrayFlatten(successfulRes.map(res => res.data));
            // If all queries have failed, return first error message
            return countryAlltimeRes[0].error;

        })
        .catch((error: Error) => {
            console.error(`Error on create all time country promises for ${code}: ${error.message}`);
            return error.message;
        })

    
}




function toArray(obj: any) {
    /**
     * Return obj if obj is array otherwise [obj]
     */
    return (typeof(obj) === typeof(["hello"])) ? obj : [obj];
}
