import { AnnualForecast, MonthlyForecast } from "../models/interfaces";

export function getMonthAnnualVal(fc :AnnualForecast | MonthlyForecast) {
    /**
     * Returns fc["annualVal"] or fc["monthVals"] depending on object
     */
    if ("annualVal" in fc) return fc.annualVal
    else if ("monthVals" in fc) return fc.monthVals
    else return null
}