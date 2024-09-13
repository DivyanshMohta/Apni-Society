import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './Home-Css.css';
import namelogo from '../Images/Only_name_logo.png';
import logoo from '../Images/logoo.png';
import Home_1 from '../Images/home_1.jpg';
import Home_2 from '../Images/home_2.avif';
import Home_3 from '../Images/home_3.jpg';
import profileIcon from '../Images/profile_icon.png'; // Import your profile icon
import { auth } from './firebaseConfig'; // Import Firebase auth

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0); // State for slideshow index
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

    useEffect(() => {
        // Slideshow functionality
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;

        const showSlides = () => {
            slides.forEach((slide, index) => {
                slide.style.display = index === slideIndex ? 'block' : 'none';
            });

            setSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
        };

        // Set interval for slideshow
        const slideInterval = setInterval(showSlides, 3000);

        // Clean up the interval on unmount
        return () => clearInterval(slideInterval);
    }, [slideIndex]); // Re-run effect when slideIndex changes

    const handleLogout = () => {
        auth.signOut().then(() => {
            setIsLoggedIn(false);
            navigate('/startup'); // Redirects to login after logout
        });
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo-section">
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
                            <a href="Dashboard" onClick={() => navigate('/Dashboard')}>Dashboard</a>
                            <div className='profile-menu'>
                                <img src={profileIcon} alt="Profile" className='profile_icon' />
                                <div className="dropdown-content">
                                    <p>Profile</p>
                                    <p onClick={handleLogout}>Logout</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='home-page_login_btn'>
                            <button onClick={() => navigate('/startup')}>Login</button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Slideshow Section */}
            <div className="slideshow-container">
                <div className="slide fade">
                    <img src={Home_1} alt="Slide 1" />
                </div>
                <div className="slide fade">
                    <img src={Home_2} alt="Slide 2" />
                </div>
                <div className="slide fade">
                    <img src={Home_3} alt="Slide 3" />
                </div>
                <div className="text-overlay">
                    <h3>AAPKI SOCIETY, AAPKA HAQ</h3>
                    <p>Connecting You with Your Community</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
