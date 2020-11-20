import { useGraphQL} from "./graphql"
import { AlltimePrecipitationQuery, AlltimeTemperatureQuery } from "../graphql/queries/ForecastsQueries"
import { grossToAnom } from "../utils/string";


const VARIABLE_TO_QUERY = {
    "temperature": AlltimeTemperatureQuery,
    "precipitation": AlltimePrecipitationQuery
}

export function useFetchAll() {
    const graphqlRes = {};

    for (const [variable, query] of Object.entries(VARIABLE_TO_QUERY)) {
        const anomVariable = grossToAnom(variable);
        graphqlRes[variable] = useGraphQL(query, { type: "avg"});
        graphqlRes[anomVariable] = useGraphQL(query, { type: "anom"});
    }

    return graphqlRes;


}