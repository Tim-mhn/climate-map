import { gql } from '@apollo/client';

export const HelloQuery = gql`
  query HelloWorld {
    hello
  }
`;