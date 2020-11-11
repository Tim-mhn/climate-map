import { useGraphQL} from "./graphql"
import { AlltimePrecipitationQuery, AlltimeTemperatureQuery } from "../graphql/queries/ForecastsQueries"
import { useEffect, useState } from "react";
import { grossToAnom } from "../utils/string";



const VARIABLE_TO_QUERY = {
    "temperature": AlltimeTemperatureQuery,
    "precipitation": AlltimePrecipitationQuery
}

export function useFetchAll() {
    const [fetchedAll, setFetchedAll] = useState(false);

    const graphqlRes = {};

    for (const [variable, query] of Object.entries(VARIABLE_TO_QUERY)) {
        const anomVariable = grossToAnom(variable);
        graphqlRes[variable] = useGraphQL(query, { type: "avg"});
        graphqlRes[anomVariable] = useGraphQL(query, { type: "anom"});
    }

    
    useEffect(() => {
        if (fetchedAll) return;
        /* Wait that all queries have loaded to update fetchedAll */
        if (Object.values(graphqlRes).every(res => res[2])) setFetchedAll(true)
    }, [graphqlRes]);

    
    return [graphqlRes, fetchedAll];


}