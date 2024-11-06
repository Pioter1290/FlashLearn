import React, { useState } from 'react';
import './RegisterForm.css';
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom'; 
import RegisterValidation from './RegisterValidation';
import axios from 'axios';


const RegisterForm = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({
      ...prev, [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = RegisterValidation(values);
    setErrors(validationErrors);
  
    console.log("Validation errors:", validationErrors); 
  
    if (validationErrors.name === "" && validationErrors.email === "" && validationErrors.password === "") {
      console.log("Sending data to server:", values); 
      axios.post("http://localhost:8081/signup", values)
        .then(response => {
          console.log("Server response:", response.data); 
          alert(response.data.message); 
          navigate('/');
        })
        .catch(err => console.log("Server error:", err)); 
    }
  };
  

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>FlashLearn</h1>
        <div className="input-box">
          <input 
            type="text" 
            placeholder="Enter your name" 
            name="name" 
            value={values.name} 
            onChange={handleInput} 
            required 
          />
          <FaRegUserCircle className='icon' />
          {errors.name && <p className="text-danger">{errors.name}</p>}
        </div>
        <div className="input-box">
          <input 
            type="email" 
            placeholder="Enter your e-mail" 
            name="email"
            value={values.email} 
            onChange={handleInput} 
            required 
          />
          <MdOutlineAlternateEmail className='icon' />
          {errors.email && <p className="text-danger">{errors.email}</p>}
        </div>
        <div className="input-box">
          <input 
            type="password" 
            placeholder="Enter your password" 
            name="password"
            value={values.password} 
            onChange={handleInput} 
            required 
          />
          <RiLockPasswordLine className='icon' />
          {errors.password && <p className="text-danger">{errors.password}</p>}
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
