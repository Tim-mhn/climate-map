import { useGraphQL} from "./graphql"
import { AlltimePrecipitationQuery, AlltimeTemperatureQuery } from "../graphql/queries/ForecastsQueries"


export function useFetchAll() {
    const [tLoading, tError, tData] = useGraphQL(AlltimeTemperatureQuery);
    const [pLoading, pError, pData] = useGraphQL(AlltimePrecipitationQuery);

    return {
        "temperature": [tLoading, tError, tData],
        "precipitation": [pLoading, pError, pData]
    }


}