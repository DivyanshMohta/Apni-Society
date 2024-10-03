import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'; // Social Media Icons

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <h2>Aapni Society</h2>
                    <p>Aapki Society, Aapka Haq</p>
                </div>
                <div className="footer-links">
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Support</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>
                <div className="footer-social">
                    <a href="#"><FaFacebook /></a>
                    <a href="#"><FaTwitter /></a>
                    <a href="#"><FaLinkedin /></a>
                    <a href="#"><FaInstagram /></a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024 AapniSociety. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
