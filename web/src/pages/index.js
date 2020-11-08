import { Main } from '../components/Main'


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
        <Main/>
        </div>
      </React.Fragment>
)

export default Index
