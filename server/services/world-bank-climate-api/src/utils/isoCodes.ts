import { loadJson } from "./promises";


const ISO3_ENDPOINTS = "http://countries.petethompson.net/data/countries.json"
const MIN_RELEVANCE = 2.5;

let iso3Codes: string[] = [];

async function fetchIsoCodes(): Promise<boolean> {
    /**
     * Fetch list of all codes from public api and update attribute
     */
    console.count("Fetch iso codes called !")
    try {
        let data: any[] = await loadJson(ISO3_ENDPOINTS);
        const relevant: any[] = data.filter(v => +v.relevance >= MIN_RELEVANCE);
        iso3Codes = relevant.map(val => val['cca3']);

        console.log(iso3Codes);

        return true
    } catch (err) {
        console.error(err);
        return false;
    }

}

export async function getIsoCodes() : Promise<any[] | null> {
    /**
     * Returns a promise of the list of all country ISO3 codes
     */
    console.count("Get iso codes called")
    if (iso3Codes.length < 1) await fetchIsoCodes(); // API request in case list is empty
    return [...iso3Codes] // Return a copy of the list that can be edited without changing this class iso3codes
}




