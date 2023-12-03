import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { connectToIndexedDB } from './services/indexedDB';
import Container from './components/Container';
import Main from './pages/Main';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Register from './pages/Register';
import WelcomePage from './pages/WelcomePage';
import Playlist from './pages/Playlist';
import Player from './components/Player';

export const audioDB = new connectToIndexedDB('AudioDatabase', 1);

function App() {
  const currentRoute = window.location.pathname;
  const showPlayer = ['/', '/playlist'].includes(currentRoute);

  return (
    <Router>
      <Container>
        <ToastContainer position='top-center' pauseOnHover={false}/>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/playlist" element={<Playlist/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/welcome" element={<WelcomePage/>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
        {showPlayer && <Player/>}
      </Container>
    </Router>
  );
}

export default App;
