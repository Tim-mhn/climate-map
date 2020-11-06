import { useGraphQL} from "./graphql"
import { AlltimePrecipitationQuery, AlltimeTemperatureQuery } from "../graphql/queries/ForecastsQueries"
import { useEffect, useState } from "react";



const VARIABLE_TO_QUERY = {
    "temperature": AlltimeTemperatureQuery,
    "precipitation": AlltimePrecipitationQuery
}

export function useFetchAll() {
    const [fetchedAll, setFetchedAll] = useState(false);

    const graphqlRes = {};

    for (const [variable, query] of Object.entries(VARIABLE_TO_QUERY)) {
        const anomVariable = `${variable}Anom`;
        graphqlRes[variable] = useGraphQL(query, { type: "avg"});
        graphqlRes[anomVariable] = useGraphQL(query, { type: "anom"});
    }

    
    useEffect(() => {
        if (fetchedAll) return;
        if (Object.values(graphqlRes).every(res => res[2])) setFetchedAll(true)
    }, [graphqlRes]);

    
    return [graphqlRes, fetchedAll];


}