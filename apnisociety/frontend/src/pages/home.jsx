import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './Home-Css.css';
import namelogo from '../Images/Only_name_logo.png';
import logoo from '../Images/logoo.png';
import Home_1 from '../Images/home_1.jpg';
import Home_2 from '../Images/home_2.avif';
import Home_3 from '../Images/home_3.jpg';
import AboutUs from './Home-page-feat/aboutus';
import Services from './Home-page-feat/services';
import ContactUs from './Home-page-feat/contactus';
import Footer from './Home-page-feat/footer';
import profileIcon from '../Images/profile_icon.png'; 
import { auth, db, storage } from './firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import UserProfile from './Services/UserProfile';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // State for slideshow index
    const [slideIndex, setSlideIndex] = useState(0); 
    const [profilePicUrl, setProfilePicUrl] = useState(null); // State to store profile picture URL
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
                setUserId(user.uid);
            } else {
                setIsLoggedIn(false);
            }
        });
    }, []);

    useEffect(() => {
        const fetchProfilePic = async () => {
            if (isLoggedIn && userId) {
                try {
                    const userDocRef = doc(db, 'Users', userId);
                    const userDocSnap = await getDoc(userDocRef);
                    console.log(userDocSnap.exists());
    
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        const profilePicURL = userData.profileURL;
    
                        console.log("Fetched profileURL:", profilePicURL); // Debug log
                        setProfilePicUrl(profilePicURL || null); // Set URL or null for default
                    } else {
                        console.log("No such document!");
                        setProfilePicUrl(null);
                    }
                } catch (error) {
                    console.error("Error fetching profile picture:", error);
                    setProfilePicUrl(null);
                }
            }
        };
    
        fetchProfilePic();
    }, [isLoggedIn, userId]);
    
    

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

    const handleProfile = () => {
        navigate('/userprofile');
    }

    const handleLogout = () => {
        auth.signOut().then(() => {
            setIsLoggedIn(false);
            navigate('/Startup'); // Redirects to login after logout
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
                    
                    <a href="#about-us">About Us</a>
                    <a href="#services">Services</a>
                    <a href="#footer">Support</a>
                    <a href="#contact-us">Contact Us</a>
                    {/* {isLoggedIn ? (
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
                            <button onClick={() => navigate('/Startup')}>Login</button>
                        </div>
                    )} */}
                    {isLoggedIn ? (
                        <>
                            <a href="Dashboard" onClick={() => navigate('/Dashboard')}>Dashboard</a>
                            <div className='profile-menu'>
                                {/* Render user's profile picture if available, otherwise show default */}
                                <img src={profilePicUrl || profileIcon} alt="Profile" className='profile_icon' />
                                <div className="dropdown-content">
                                    <p onClick={handleProfile}>Profile</p>
                                    <p onClick={handleLogout}>Logout</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='home-page_login_btn'>
                            <button onClick={() => navigate('/Startup')}>Login</button>
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
            <div className="content">
            <section id="about-us">
                <AboutUs />
            </section>
            <section id="services">
                <div>
                    <h2>Services We Provide</h2>
                </div>
                <Services />
            </section>
            <section id="contact-us">
                <ContactUs />
            </section>
            <section id="footer">
                <Footer />
            </section>
        </div>
        </div>
    );
};

export default HomePage;
