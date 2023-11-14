import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Container from './components/Container'
import Main from './pages/Main'
import Login from './pages/Login'
import PageNotFound from './pages/PageNotFound'
import Register from './pages/Register'
import { connectToIndexedDB } from './services/indexedDB'

export const audioDB = new connectToIndexedDB('AudioDatabase', 1);

function App() {
  return (
    <Router>
      <Container>
        <ToastContainer position='top-center' pauseOnHover={false}/>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
