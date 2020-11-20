import { BasicCountryRequestResponse, ExtendedForecast } from "../models/interfaces";
import { addAnnualVals } from "./forecast";

const nodeFetch = require("node-fetch")

export function loadJson(url: string) : Promise<any> {
    return nodeFetch(url)
      .then((response: any) => {
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error(response.error);
        }
      })
  }


export function createCountryPromise(url: string, code: string): Promise<BasicCountryRequestResponse> {
  /**
   *  Create a promise for each country to handle bad requests (like for Antarticta) and return null in that case
   *  Inputs: base url and iso3 country code
   */
  return nodeFetch(`${url}${code}`)
      .then((res: any) => res.json())
      .then((res: ExtendedForecast[])  => {
          return { data: addAnnualVals(res), error: null }
      })
      .catch((err: Error) => {
          const errorMsg = `Error when fetching from ${url}${code}. Details: ${err.message}`;
          console.error(errorMsg);
          return { data: null, error: errorMsg }
      })
}