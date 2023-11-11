import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react';
import axios from 'axios';
import Container from './components/Container'
import Main from './pages/Main'
import Login from './pages/Login'
import PageNotFound from './pages/PageNotFound'
import Register from './pages/Register'

function App() {
  const request = async () => {
    await axios.get('https://tabely.onrender.com/users');
  }

  useEffect(() => {
    setInterval(request, 300000);
  })

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
