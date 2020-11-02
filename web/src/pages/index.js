import {
  Link as ChakraLink,
  Text,
} from '@chakra-ui/core'

import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Footer } from '../components/Footer'
// import dotenv from 'dotenv'

// dotenv.config()


const Index = () => (
  <Container>
   
    <DarkModeSwitch />
    <Footer>
      <Text>Next ❤️ Chakra NO RELOAD</Text>
    </Footer>
  </Container>
)

export default Index
