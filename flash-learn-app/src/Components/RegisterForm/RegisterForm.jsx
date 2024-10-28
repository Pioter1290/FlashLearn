import './RegisterForm.css';
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link } from 'react-router-dom'; 

const RegisterForm = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>FlashLearn</h1>
        <div className="input-box">
          <input type="email" placeholder="Enter your e-mail" required />
          <FaRegUserCircle className='icon' />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Enter your password" required />
          <RiLockPasswordLine className='icon' />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Repeat your password" required />
          <RiLockPasswordLine className='icon' />
        </div>
        
        <button type="submit">Register</button>
        <div className="register-link">
          <p>Already have an account? <Link to="/">Login</Link></p> 
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
