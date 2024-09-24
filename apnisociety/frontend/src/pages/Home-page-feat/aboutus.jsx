import React from 'react';
import aboutUsImage from '../.././Images/aboutusImage.jpg'; // Import your image
import './AboutUs.css'; // Add a separate CSS file for About Us

const AboutUs = () => {
    return (
        <div className="aboutus-container">
            <div className="aboutus-info">
                <h2>About Us</h2>
                <p>
                    We are dedicated to creating a seamless experience for society management. Our mission is to
                    connect residents and management to provide a better, more organized living experience.
                </p>
            </div>
            <div className="aboutus-img">
                <img src={aboutUsImage} alt="About Us" />
            </div>
        </div>
    );
};

export default AboutUs;
