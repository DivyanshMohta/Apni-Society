import React, { useState } from 'react';
import './Register.css'; // Correct CSS file for Register component

const Register = ({ onSignIn, image }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful', data);
      } else {
        console.log('Registration failed', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <div className="info">
        <form className="register-form" onSubmit={handleRegister}>
          <span className="heading"><h1>Sign Up</h1></span>
          <div className="validate-input" data-validate="Name is required">
            <input 
              className="input" 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <i className="fa fa-user"></i>
          </div>
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
          <div className="validate-input" data-validate="Phone is required">
            <input 
              className="input" 
              type="text" 
              name="phone" 
              placeholder="Phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
            <i className="fa fa-phone"></i>
          </div>

          <div className="signup-btn">
            <button className="btn" type="submit">Sign Up</button>
          </div>

          <div className="sign-in-option">
            <span>Already have an account? </span>
            <button type="button" className="sign-in-link" onClick={onSignIn}>Sign In</button>
          </div>
        </form>
      </div>
      <div className="image" style={{ backgroundImage: `url(${image})` }}></div>
    </div>
  );
}

export default Register;
