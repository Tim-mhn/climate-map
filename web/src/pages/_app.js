import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import { ApolloClient, InMemoryCache, ApolloProvider  } from '@apollo/client';
import theme from '../theme'


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
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
