/* eslint-disable react/react-in-jsx-scope */
import { HelloQuery } from '../graphql/queries/HelloQuery';
import { TemperatureQuery } from '../graphql/queries/TemperatureQuery';
import {  useQuery } from '@apollo/client';


export const Hello = () => {
  const { loading, error, data } = useQuery(HelloQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  console.log(data);
  return (
    <p>Success boy</p>
  );
};

export const Temperatures = () => {

  const start = "2020";
  const end = "2039";
  const { loading, error, data } = useQuery(TemperatureQuery,
    { variables: { start, end }
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
    return <p>Oh no... {error.message}</p>;
  }
  console.log(data);
  return (
    <p>Success boy</p>
  );
};