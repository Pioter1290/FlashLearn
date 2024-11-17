// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import MainPage from './Components/MainPage/MainPage';
import FlashCards from './Components/FlashCards/flashcards';
import Particle from './Components/Particle';

function App() {
  return (
    <Router>
      <div style={{ position: 'relative', height: '100vh' }}>
        {/* Particle background */}
        <Particle />

        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/page" element={<MainPage />} />
          <Route path="/flashcards" element={<FlashCards />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
