import { useGraphQL} from "./graphql"
import { AlltimePrecipitationQuery, AlltimeTemperatureQuery } from "../graphql/queries/ForecastsQueries"
import { useEffect, useState } from "react";
import { grossToAnom } from "../utils/string";
import { GraphQLError } from "graphql";



const VARIABLE_TO_QUERY = {
    "temperature": AlltimeTemperatureQuery,
    "precipitation": AlltimePrecipitationQuery
}

export function useFetchAll() {
    const [resolvedQueriesCount, setResolvedQueriesCount] = useState(0);
    const graphqlRes = {};

    for (const [variable, query] of Object.entries(VARIABLE_TO_QUERY)) {
        const anomVariable = grossToAnom(variable);
        graphqlRes[variable] = useGraphQL(query, { type: "avg"});
        graphqlRes[anomVariable] = useGraphQL(query, { type: "anom"});
    }

    
    useEffect(() => {
        if (resolvedQueriesCount == Object.keys(graphqlRes).length) return
        // Resolves queries have data (2nd element) not null
        const _resolvedQueriesCount = Object.values(graphqlRes).filter(res => res[2]).length;
        // Send signal if we've resolved some new queries
        if (_resolvedQueriesCount > resolvedQueriesCount) setResolvedQueriesCount(_resolvedQueriesCount);
    }, [graphqlRes]);

    return [graphqlRes, resolvedQueriesCount];


}