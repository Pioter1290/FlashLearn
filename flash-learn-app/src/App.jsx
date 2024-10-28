
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import MainPage from './Components/MainPage/MainPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/page" element={<MainPage />} />
        
        
        
      </Routes>
    </Router>
  );
}

export default App;
