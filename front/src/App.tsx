import { BrowserRouter as Router } from 'react-router-dom'
import Container from './components/Container'
import Leftbar from './components/Leftbar'
import MainTop from './components/MainTop'
import Player from './components/Player'

function App() {
  return (
    <Router>
      <Container>
        <MainTop/>
        <Leftbar/>
        <Player/>
      </Container>
    </Router>
  )
}

export default App;
