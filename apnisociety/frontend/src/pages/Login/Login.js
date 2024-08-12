import React, { useState } from 'react';
import './Login.css'; // Correct CSS file for Login component

const Login = ({ onSignUp, image }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful', data);
      } else {
        console.log('Login failed', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="info">
        <form className="login-form" onSubmit={handleLogin}>
          <span className="heading"><h1>Member Login</h1></span>
          <div className="validate-input" data-validate="Enter a valid Email">
            <input 
              className="input" 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <i className="fa fa-envelope"></i>
          </div>
          <div className="validate-input" data-validate="Password is required">
            <input 
              className="input" 
              type="password" 
              name="pass" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <span><i className="fa fa-lock"></i></span>
          </div>

          <div className="login-btn">
            <button className="btn" type="submit">Login</button>
          </div>

          <div className="sign-up-option">
            <span>Don't have an account? </span>
            <button type="button" className="sign-up-link" onClick={onSignUp}>Sign Up</button>
          </div>
        </form>
      </div>
      <div className="image" style={{ backgroundImage: `url(${image})` }}></div>
    </div>
  );
}

export default Login;
