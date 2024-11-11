import React, { useState } from 'react';
import './LoginForm.css';
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom'; 
import Validation from './LoginValidation'; 
import axios from 'axios'; 

const LoginForm = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))

  }

  const handleLogin = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    if (errors.email === "" && errors.password === "") {
        axios.post('http://localhost:8081/login', values)
            .then(async (res) => {
                if (res.data.message === "Success") {
                    localStorage.setItem('userId', res.data.userId);
                    const folders = await fetchFolders(res.data.userId); 
                    navigate('/page');
                } else {
                    alert(res.data.message);
                }
            })
            .catch(err => console.log(err));
    }
};


const fetchFolders = async (userId) => {
  try {
      const res = await axios.get('http://localhost:8081/folders', {
          headers: { 'userId': userId }
      });

      if (res.status === 200) {
          localStorage.setItem('folders', JSON.stringify(res.data));  
          return res.data;
      }
  } catch (err) {
      console.log("Error fetching folders:", err);
      return []; 
  }
};


  return (
    <div className="wrapper">
      <form onSubmit={handleLogin}>
        <h1>FlashLearn</h1>
        <div className="input-box">
          <input 
            type="email" 
            name="email" 
            placeholder="E-mail" 
            onChange={handleInput} 
            value={values.email} 
            required 
          />
          <FaRegUserCircle className='icon' />
        </div>
        {errors.email && <p className="error">{errors.email}</p>}
        <div className="input-box">
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleInput} 
            value={values.password} 
            required 
          />
          <RiLockPasswordLine className='icon' />
        </div>
        {errors.password && <p className="error">{errors.password}</p>}
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
