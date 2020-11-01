import {
  Link as ChakraLink,
  Text,
  Code,
  Icon,
  List,
  ListIcon,
  ListItem,
} from '@chakra-ui/core'

import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { CTA } from '../components/CTA'
import { Footer } from '../components/Footer'
// import dotenv from 'dotenv'

// dotenv.config()


const Index = () => (
  <Container>
    <Main>
      <Text>
        Example repository of <Code>Next.js</Code> + <Code>chakra-UI</Code>.
      </Text>


    </Main>

    <DarkModeSwitch />
    <Footer>
      <Text>Next ❤️ Chakra NO RELOAD</Text>
    </Footer>
    <CTA />
  </Container>
)

export default Index
