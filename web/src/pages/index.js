import {
  Link as ChakraLink,
  Text,
} from '@chakra-ui/core'

import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Footer } from '../components/Footer'
import { RMapGL } from '../components/ReactMapGL'
// import dotenv from 'dotenv'

// dotenv.config()


const Index = () => (
  <React.Fragment>
      <div
        style={{
          position: 'fixed',
          width: '100vw',
          height: 'inherit',
          display: 'flex',
          flexDirection: 'column', 
          alignItems: 'stretch',
        }}
      >
        <RMapGL/>
        </div>
      </React.Fragment>
)

export default Index
