import { ApolloServer } from 'apollo-server-express';
const express = require('express')
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { AnnualAverageForecastResolver } from './resolvers/annualAverageFc';

import UserResolver from './resolvers/userResolver';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [AnnualAverageForecastResolver],
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
