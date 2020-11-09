import { AnnualForecast, MonthlyForecast } from "../models/interfaces";
import { arraySum } from "./array";

export function getMonthAnnualVal(fc :AnnualForecast | MonthlyForecast) {
    /**
     * Returns fc["annualVal"] or fc["monthVals"] depending on object
     */
    if ("annualVal" in fc) return fc.annualVal
    else if ("monthVals" in fc) return fc.monthVals
    else return null
}

export function addAnnualVals(forecasts: MonthlyForecast[]) {
    return forecasts.map((el: any) => {
        el = {...el, annualVal: [arraySum(el.monthVals)]}
        return el
    })

}

