import React, { useState } from 'react';
import './style.css';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { db } from './firebaseConfig';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Startup = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signUpName, setSignUpName] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();

    const toggleForm = () => setIsSignUp(!isSignUp);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, signInEmail);
            alert('Password reset email sent!');
        } catch (error) {
            console.error('Error during password reset:', error.message);
            alert(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const userDocRef = doc(db, "Users", result.user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                navigate(userData.contact ? '/' : '/userdetails');
            } else {
                // Add new user data if it doesn't exist
                await setDoc(userDocRef, {
                    name: result.user.displayName || "Anonymous",
                    email: result.user.email,
                    userID: result.user.uid,
                    contact: null
                });
                navigate('/userdetails');
            }
        } catch (error) {
            console.error('Error during Google login:', error.message);
            alert('Failed to log in with Google. Please try again.');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);

            const userDocRef = doc(db, "Users", userCredential.user.uid);
            await setDoc(userDocRef, {
                name: signUpName,
                email: signUpEmail,
                password: signUpPassword, // Store plain text password (not recommended)
                userID: userCredential.user.uid,
                contact: null // Placeholder for contact
            });

            console.log('Registration successful:', userCredential.user);

            const userDocSnapshot = await getDoc(userDocRef);
            const userData = userDocSnapshot.data();

            navigate(userData.contact ? '/' : '/userdetails');
        } catch (error) {
            console.error('Error during registration:', error.message);
            alert(error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
            console.log('Login successful:', userCredential.user);
            navigate('/');
        } catch (error) {
            console.error('Error during login:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
            {/* Sign-Up Form */}
            <div className="form-container sign-up">
                <form onSubmit={handleSignUp}>
                    <h1>Create Account</h1>
                    <div className="social-icons">
                        <a href="#" className="icon" onClick={handleGoogleLogin}>
                            <i className="fa-brands fa-google"></i>
                        </a>
                        <a href="#" className="icon">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                    </div>
                    <span>or use your email for registration</span>
                    <input
                        type="text"
                        placeholder="Name"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                        title="Must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long"
                        placeholder="Password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
            </div>

            {/* Sign-In Form */}
            <div className="form-container sign-in">
                <form onSubmit={handleLogin}>
                    <h1>Sign In</h1>
                    <div className="social-icons">
                        <a href="#" className="icon" onClick={handleGoogleLogin}>
                            <i className="fa-brands fa-google"></i>
                        </a>
                        <a href="#" className="icon">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                    </div>
                    <span>or use your email and password</span>
                    <input
                        type="email"
                        placeholder="Email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                    />
                    <a href="#" onClick={handlePasswordReset}>Forget Your Password?</a>
                    <button type="submit">Login</button>
                </form>
            </div>

            {/* Toggle Panel */}
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use all of the site's features</p>
                        <button className="hidden" onClick={() => setIsSignUp(false)}>Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all of the site's features</p>
                        <button className="hidden" onClick={() => setIsSignUp(true)}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Startup;
