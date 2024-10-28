import './LoginForm.css';
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom'; 

const LoginForm = () => {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault(); 
    navigate('/page'); 
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleLogin}>
        <h1>FlashLearn</h1>
        <div className="input-box">
          <input type="email" placeholder="E-mail" required />
          <FaRegUserCircle className='icon' />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <RiLockPasswordLine className='icon' />
        </div>
        <div className="remember-forgot">
          <label><input type="checkbox" />Remember me</label>
          <p> <Link to="/forgot-password">Forgot Password?</Link></p>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Register</Link></p> 
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
