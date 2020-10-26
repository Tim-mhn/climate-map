import React, { useEffect, useState} from "react"
import { useQuery } from '@apollo/client';
import { TemperatureQuery } from '../graphql/queries/TemperatureQuery';

export const useGraphQL = (years, query) => {
    // const [years, setYears] = useState(initialYears);


    console.log("Use GraphQL hook called !");
    const { loading, error, data } = useQuery(query, { variables: { ...years }});
    const [component, setComponent] = useState(<p>Loading...</p>);

    useEffect( () => {
        var comp = data ? <p>Success</p> : <p>Loading or error ...</p>;
        setComponent(comp);
    }, [data])
    

    return  (
        component
    )
    
    
    
    // return [values, e => {
    //     console.log("handle change called")
    //     setValues({
    //         ...values,
    //         [e.target.name]: e.target.value
    //     })
    // }]


}


// const _loadTemperatureData = () => {
//     const start = "2020";
//     const end = "2039";
//     const { loading, error, data } = useQuery(TemperatureQuery,
//     { variables: { start, end }
//     });

//     if (data) console.log(data);
//     else if(loading) console.info("loading")
//     else console.error(error)

//     getAllGeoJSONs().then(geojson => console.log(geojson));
// }