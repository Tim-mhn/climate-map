import React, { useEffect, useState} from "react"
import { useQuery } from '@apollo/client';
import { TemperatureQuery } from '../graphql/queries/ForecastsQueries';

export const useGraphQL = (query, variables) => {
    // const [years, setYears] = useState(initialYears);


    const { loading, error, data } = useQuery(query, { variables: variables});

    return  [loading, error, data]
    
}
