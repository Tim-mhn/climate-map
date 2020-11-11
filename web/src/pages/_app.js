import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import { ApolloClient, InMemoryCache, ApolloProvider  } from '@apollo/client';
import theme from '../theme'
import '../styles/map-tooltip.css';

console.debug(`connecting to Apollo client with ${process.env.NEXT_PUBLIC_CLIMATE_API_URL}`);
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
        <Component {...pageProps} />
      </ColorModeProvider>
    </ThemeProvider>
    </ApolloProvider >
  )
}


export default MyApp
