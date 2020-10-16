import { loadJson } from "../utils/http";

export class ISOCodesFetcher {


    private static _iso3Codes: string[] = [];
    private static get iso3Codes(): string[] {
        return ISOCodesFetcher._iso3Codes;
    }
    private static set iso3Codes(value: string[]) {
        ISOCodesFetcher._iso3Codes = value;
    }

    private static async fetchIsoCodes(): Promise<boolean> {
        /**
         * Fetch list of all codes from public api and update attribute
         */
        const endpoint = "http://countries.petethompson.net/data/countries.json"

        console.count("Fetch iso codes called !")
        try {
            let data: any[] = await loadJson(endpoint);
            this.iso3Codes = data.map(val => val['cca3']);
            return true
        } catch (err) {
            console.error(err);
            return false;
        }

    }

    public static async getISO3Codes() : Promise<any[] | null> {
        /**
         * Returns a promise of the list of all country ISO3 codes
         */
        if (this.iso3Codes.length < 1) await this.fetchIsoCodes(); // API request in case list is empty
        return [...this.iso3Codes] // Return a copy of the list that can be edited without changing this class iso3codes
    }



}
