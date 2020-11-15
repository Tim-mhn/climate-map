import { Resolver, Query, Arg} from "type-graphql";
import { CountryBaseForecast } from "../entities/CountryForecast";
import { getIsoCodes } from '../utils/isoCodes';
import { BASIC_REQ_TIME_PERIODS } from '../utils/constants';
import { BasicCountryRequestResponse, ExtendedForecast, MonthlyForecast } from "../models/interfaces";
import { arrayFlatten } from "../utils/array";
import { createCountryPromise } from "../utils/promises";
import { CountryHistory, YearData } from "../entities/CountryHistory";


const nodeFetch = require("node-fetch")

@Resolver()
export class HistoryResolver {

    
    @Query(() => CountryHistory)
    async history(
        @Arg("iso3", () => String) iso3: string,
        @Arg("variable", () => String) variable: 'tas' | 'pr',
    ) {
        /**
         * Returns average data for given variable and country for each year between 1901 and 2012
         */
        console.info(`History query called for ${iso3}:${variable}`)
        let baseUrl = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/"
        let url = `${baseUrl}${variable}/year/${iso3}`;


        return nodeFetch(url)
                .then(res => res.json())
                .then((res: YearData[]) => { 
                    // Rename "data" into "value" key.
                    // TODO: simplify this mess. Write a utils function maybe
                    return { 
                        "country": iso3, 
                        "data": res.map(yearData => { 
                                return { "year": yearData.year, "value": yearData.data}
                            })
                        }
                    })
                .catch(err => { return { "country": iso3, "error": err.message }})

    }

}