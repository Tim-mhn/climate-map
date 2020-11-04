import { useGraphQL} from "./graphql"
import { AlltimePrecipitationQuery, AlltimeTemperatureQuery } from "../graphql/queries/ForecastsQueries"



function useCombineQueries() {
    // const [avgLoading, avgError, avgData] = useGraphQL(AlltimeTemperatureQuery, { type: "avg" });
    // const [anomLoading, anomError, anomData] = useGraphQL(AlltimePrecipitationQuery, { type: "anom" });

    // let data;
    // if (avgData && anomData) { 
    //     console.log(avgData);
    //     console.log(anomData)    
    // };


    // console.log(data);

    // return data;

}


export function useFetchAll() {
    const [tLoading, tError, tData] = useGraphQL(AlltimeTemperatureQuery, { type: "avg" });
    const [pLoading, pError, pData] = useGraphQL(AlltimePrecipitationQuery, { type: "avg" });
    // useCombineQueries();
    // console.log(tData);
    // console.log(pData)

    return {
        "temperature": [tLoading, tError, tData],
        "precipitation": [pLoading, pError, pData]
    }


}