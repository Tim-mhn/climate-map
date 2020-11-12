import Head from 'next/head'
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import { ApolloClient, InMemoryCache, ApolloProvider  } from '@apollo/client';
import theme from '../theme'
import '../styles/map-tooltip.css';

console.debug(`Connecting to Apollo Client with ${process.env.NEXT_PUBLIC_CLIMATE_API_URL}`);
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_CLIMATE_API_URL,
  cache: new InMemoryCache()
});


function MyApp({ Component, pageProps }) {

 
  return (
    <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <Head>
          <title>Our Climate | Our Fight</title>
          <link rel="shortcut icon" href="/planet.png" />
        </Head>
        <Component {...pageProps} />
      </ColorModeProvider>
    </ThemeProvider>
    </ApolloProvider >
  )
}


export default MyApp
