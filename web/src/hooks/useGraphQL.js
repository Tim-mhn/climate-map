import React, { useEffect, useState} from "react"
import { useQuery } from '@apollo/client';
import { TemperatureQuery } from '../graphql/queries/TemperatureQuery';

export const useGraphQL = (years, query) => {
    // const [years, setYears] = useState(initialYears);


    const { loading, error, data } = useQuery(query, { variables: { ...years }});
    // const [component, setComponent] = useState(<p>Loading...</p>);

    // useEffect( () => {
    //     console.log(data);
    //     const comp = (loading || error) ? <p>Loading or error ...</p> : <p>Success</p> ;
    //     setComponent(comp);
    // }, [loading, error, data])
    

    return  [loading, error, data]
    
}
