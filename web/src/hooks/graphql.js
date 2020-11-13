import { useQuery } from '@apollo/client';

export const useGraphQL = (query, variables) => {
    const { loading, error, data } = useQuery(query, { variables: variables});
    return  [loading, error, data]
    
}
