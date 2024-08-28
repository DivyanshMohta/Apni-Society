import React, { useState } from 'react';
import './style.css'; // Ensure this path matches your directory structure
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Startup = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google login successful:', result.user);
            navigate('/home');
        } catch (error) {
            console.error('Error during Google login:', error.message);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Registration successful:', userCredential.user);
            navigate('/home');
        } catch (error) {
            console.error('Error during registration:', error.message);
            alert(error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful:', userCredential.user);
            navigate('/home');
        } catch (error) {
            console.error('Error during login:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
            <div className="form-container sign-up">
                <form onSubmit={handleSignUp}>
                    <h1>Create Account</h1>
                    <div className="social-icons">
                        <a href="#" className="icon" data-tooltip="Google" onClick={handleGoogleLogin}><i className="fa-brands fa-google"></i></a>
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
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}" 
                        title="Must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long" 
                        required
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
                        <a href="#" className="icon" data-tooltip="Google" onClick={handleGoogleLogin}><i className="fa-brands fa-google"></i></a>
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
                    <button type="submit">Login</button>
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
