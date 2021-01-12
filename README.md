# Climate Map

A world map to alert people on climate change consequences. Forecasts per country on various variables and models such as temperature, precipitation, dry days using [World bank Climate Api](https://datahelpdesk.worldbank.org/knowledgebase/articles/902061-climate-data-api)

![screenshot-map](https://github.com/Tim-mhn/climate-map/blob/main/img/screenshot.png?raw=true)


### Stack :

#### Server:
[Express](https://expressjs.com/), Typescript, [GraphQL](https://graphql.org/graphql-js/), [Apollo Server](https://www.apollographql.com/docs/apollo-server/)

#### Client: 
React, [Next.js](https://nextjs.org/), [MaterialUI](https://material-ui.com/), [MapboxGL](https://visgl.github.io/react-map-gl/docs/get-started/mapbox-tokens), [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

#### Devops:
Docker, Dokku, [DigitalOcean](https://www.digitalocean.com/), [Vercel](https://vercel.com/)



### To install dependencies and run project:

Open 2 terminals:

Terminal 1: (climate web service)

```bash
cd server/services/world-bank-climate-api
npm install
npm run dev
```

Terminal 2: (front-end)
```bash
cd web
npm install
npm run dev
```


