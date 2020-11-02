import { useGraphQL} from "./graphql"
import { AlltimePrecipitationQuery, AlltimeTemperatureQuery } from "../graphql/queries/ForecastsQueries"


export function useFetchAll() {
    const [tLoading, tError, tData] = useGraphQL(AlltimeTemperatureQuery, { type: "mavg" });
    const [pLoading, pError, pData] = useGraphQL(AlltimePrecipitationQuery, { type: "mavg" });

    // const [l, e, d] = useGraphQL(AlltimePrecipitationQuery, { type: "mavg" });

    return {
        "temperature": [tLoading, tError, tData],
        "precipitation": [pLoading, pError, pData]
    }


}