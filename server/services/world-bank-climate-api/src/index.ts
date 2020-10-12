import { ApolloServer } from 'apollo-server-express';
const express = require('express')
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { AverageForecastResolver } from './resolvers/averageForecastResolver';
import { DerivedStatResolver } from './resolvers/derivedStatResolver';


async function startServer() {
  const schema = await buildSchema({
    resolvers: [AverageForecastResolver, DerivedStatResolver],
    emitSchemaFile: true
  });

  const app = express();

  const server = new ApolloServer({
    schema
  });

  server.applyMiddleware({ app });

  app.listen(4001, () =>
    console.log('Server is running on http://localhost:4001/graphql')
  );
}

startServer();
