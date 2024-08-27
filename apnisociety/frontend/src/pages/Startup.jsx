import React, { useState, useRef } from 'react';
import './style.css'; // Ensure this path matches your directory structure
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Startup = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    


    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Registration successful:', userCredential.user);
            navigate('/home');
        } catch (error) {
            console.error('Error during registration:', error.message);
        }
        alert('SignIn successful');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful:', userCredential.user);
            alert('Login successfull');
            navigate('/home');

        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    

    
    return (
        <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
            <div className="form-container sign-up">
                <form onSubmit={handleSignUp}>
                    <h1>Create Account</h1>
                    <div className="social-icons">
                    
                        <a href="#" className="icon" data-tooltip="Google"><i class="fa-brands fa-google"></i></a>
                        <a href="#" className="icon" data-tooltip="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                    </div>
                    <span>or use your email for registration</span>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Register</button>
                </form>
            </div>
            <div className="form-container sign-in">
                <form onSubmit={handleLogin}>
                    <h1>Sign In</h1>
                    <div className="social-icons">
                        <a href="#" className="icon" data-tooltip="Google"><i className="fa-brands fa-google-plus-g"></i></a>
                        <a href="#" className="icon" data-tooltip="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                    </div>
                    <span>or use your email and password</span>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <a href="#">Forget Your Password?</a>
                    <button type="submit" >Login</button>
                </form>
            </div>
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use all of site features</p>
                        <button className="hidden" id="login" onClick={() => setIsSignUp(false)}>Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all of site features</p>
                        <button className="hidden" id="register" onClick={() => setIsSignUp(true)}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Startup;
