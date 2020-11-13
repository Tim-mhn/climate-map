import { ApolloServer } from 'apollo-server-express';
const express = require('express')
import 'reflect-metadata';
import "dotenv-safe/config"
import { buildSchema } from 'type-graphql';
import { AverageForecastResolver } from './resolvers/averageForecastResolver';
import { DerivedStatResolver } from './resolvers/derivedStatResolver';
import { HistoryResolver } from './resolvers/historyResolver';


async function startServer() {
  const schema = await buildSchema({
    resolvers: [AverageForecastResolver, DerivedStatResolver, HistoryResolver],
    emitSchemaFile: true
  });

  const app = express();
  app.set("proxy", 1);
  const server = new ApolloServer({
    schema
  });

  server.applyMiddleware({ app });
  const PORT = <string> process.env.PORT;
  app.listen(parseInt(PORT), () =>
    console.log(`Server is running on http://localhost:${PORT}/graphql`)
  );
}

startServer();
