import { useQuery } from 'urql';

const HelloQuery = `
  query {
    hello
  }
`;

const PrecipitationsQuery = `
  query {
      daily_ppt_forecasts(iso3: "fra", granulation: "month") {
        data {scenario, avg}
        country
      }
  }
`;

export const Hello = () => {
  const [result, reexecuteQuery] = useQuery({
    query: HelloQuery,
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  console.log(data);
  return (
    <p>Success boy</p>
  );
};

export const Precipitations = () => {
  const [result, reexecuteQuery] = useQuery({
    query: PrecipitationsQuery,
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  console.log(data);
  return (
    <p>Success boy</p>
  );
};