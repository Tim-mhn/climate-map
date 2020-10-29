import { useGraphQL} from "./graphql"
import { AlltimePrecipitationQuery, AlltimeTemperatureQuery, PrecipitationQuery, TemperatureQuery } from "../graphql/queries/ForecastsQueries"


const TIME_PERIODS = [
    ["2020", "2039"],
    ["2040", "2059"],
    ["2060", "2079"],
    ["2080", "2099"]
]

function _useFetchAllTemperatures() {

    const [loading, error, data] = useGraphQL(AlltimeTemperatureQuery);

    return [loading, error, data];
}
function _useFetchAllPrecipitations() {
    const [loading, error, data] = useGraphQL(AlltimePrecipitationQuery);

    return [loading, error, data];
}

export function useFetchAll() {
    const [tLoading, tError, tData] = useGraphQL(AlltimeTemperatureQuery);
    const [pLoading, pError, pData] = useGraphQL(AlltimePrecipitationQuery);

    return {
        "temperature": [tLoading, tError, tData],
        "precipitation": [pLoading, pError, pData]
    }


}