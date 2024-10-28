
import './ForgotPassword.css';
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom'; 

const ForgotPassword = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>FlashLearn</h1>
        <p className="info-text">Enter your email address below, and we'll send you instructions to reset your password.</p>
        
        <div className="input-box">
          <input type="email" placeholder="E-mail" required />
          <FaRegUserCircle className='icon' />
        </div>
        
        <button type="submit">Send Reset Link</button>
        
        <div className="back-to-login">
          <p>Remember your password? <Link to="/">Login</Link></p> 
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
