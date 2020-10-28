import React, { useEffect, useState} from "react"
import { useQuery } from '@apollo/client';
import { TemperatureQuery } from '../graphql/queries/ForecastsQueries';

export const useGraphQL = ({ start, end, query}) => {
    // const [years, setYears] = useState(initialYears);


    const { loading, error, data } = useQuery(query, { variables: { start, end }});
    // const [component, setComponent] = useState(<p>Loading...</p>);

    // useEffect( () => {
    //     console.log(data);
    //     const comp = (loading || error) ? <p>Loading or error ...</p> : <p>Success</p> ;
    //     setComponent(comp);
    // }, [loading, error, data])
    

    return  [loading, error, data]
    
}
