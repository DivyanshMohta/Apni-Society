import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './Home-Css.css';
import Dashboard from './Dashboard';
import namelogo from '../Images/Only_name_logo.png';
import logoo from '../Images/logoo.png';
import home_img from '../Images/image_home_page.avif';
import profileIcon from '../Images/profile_icon.png'; // Import your profile icon
import { auth } from './firebaseConfig'; // Import Firebase auth

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });
    }, []);

    const handleLogout = () => {
      auth.signOut().then(() => {
          setIsLoggedIn(false);
          navigate('/startup'); // Redirects to login after logout
      });
  };

    return (
        <>
            <div className="home-container">
                <nav className="navbar">
                    <div className="Apni-logo">
                        <a href="#">
                            <img src={logoo} className='Society-logo' alt="Society Logo" />
                        </a>
                        <a href="#">
                            <img src={namelogo} className='name-logo' alt="Name Logo" />
                        </a>
                    </div>
                    <div className="nav-links">
                        <a href="#info">Home</a>
                        <a href="#">Features</a>
                        <a href="#">Support</a>
                        <a href="#">Contact Us</a>
                        {isLoggedIn ? (
                            <>
                                <a href="Dashboard " onClick={() => navigate('/Dashboard')}>Dashboard</a>
                                <div className='profile'>
                                    <img src={profileIcon} alt="Profile"  className='profile_icon' />
                                </div>
                            </>
                        ) : (
                            <div className='home-page_login_btn'>
                                <button onClick={() => navigate('/startup')}>Login</button>
                            </div>
                        )}
                    </div>
                </nav>

                <section id='info'>
                    <div className='info-div'>
                        <h3>"AAPKI SOCIETY, AAPKA HAQ"</h3>
                        <p>
                            Welcome to AapniSociety, your go-to platform for seamless society management. From real-time visitor tracking to community updates and essential services, we simplify every aspect of living in a gated community. Stay connected, stay informed, and make your society a better place with AapniSociety.
                        </p>
                    </div>
                    <div className='info-img'>
                        <img src={home_img} alt="Home" />
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;
