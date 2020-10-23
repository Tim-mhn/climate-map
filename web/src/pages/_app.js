import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core'
import { createClient, Provider, useQuery } from 'urql';
import theme from '../theme'

const client = createClient({ url: 'http://localhost:4000/graphql' });

// const HelloQuery = `
//   query {
//     hello
//   }
// `;



function MyApp({ Component, pageProps }) {

 
  return (
    <Provider value={client}>
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <Component {...pageProps} />
      </ColorModeProvider>
    </ThemeProvider>
    </Provider>
  )
}


export default MyApp
