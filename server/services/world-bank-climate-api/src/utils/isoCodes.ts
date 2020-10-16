import { loadJson } from "./loadJson";


let iso3Codes: string[] = [];

async function fetchIsoCodes(): Promise<boolean> {
    /**
     * Fetch list of all codes from public api and update attribute
     */
    const endpoint = "http://countries.petethompson.net/data/countries.json"

    console.count("Fetch iso codes called !")
    try {
        let data: any[] = await loadJson(endpoint);
        iso3Codes = data.map(val => val['cca3']);
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
    if (iso3Codes.length < 1) await fetchIsoCodes(); // API request in case list is empty
    return [...iso3Codes] // Return a copy of the list that can be edited without changing this class iso3codes
}




