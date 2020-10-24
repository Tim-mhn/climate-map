import { gql, useQuery } from '@apollo/client';

export const HelloQuery = gql`
  query HelloWorld {
    hello
  }
`;