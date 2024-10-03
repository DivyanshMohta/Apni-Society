import React from 'react';
import Dashboard from '../Dashboard'
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaUserCheck, FaTshirt, FaCarrot, FaCar, FaHome } from 'react-icons/fa'; // Importing the correct icons
import './services.css'; // Custom CSS for the card

const ServiceCard = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: 'Society Management',
            description: 'Manage your community efficiently with our dedicated services.',
            icon: <FaUsers className="service-icon" />,
            route: '../Dashboard',
        },
        {
            title: 'Guest In/Out',
            description: 'Efficient tracking of guests entering and exiting your premises.',
            icon: <FaUserCheck className="service-icon" />,
            route: '../Dashboard',
        },
        {
            title: 'Laundry Services',
            description: 'Get your clothes washed and delivered at your convenience.',
            icon: <FaTshirt className="service-icon" />,
            route: '../Dashboard',
        },
        {
            title: 'Vegetable Vendor',
            description: 'Fresh vegetables delivered straight to your doorstep.',
            icon: <FaCarrot className="service-icon" />,
            route: '../Dashboard',
        },
        {
            title: 'Car Wash',
            description: 'Keep your vehicle clean and shiny with our top-notch car wash services.',
            icon: <FaCar className="service-icon" />,
            route: '../Dashboard',
        },
        {
            title: 'Home Repair',
            description: 'Quality home repair services for all your needs.',
            icon: <FaHome className="service-icon" />,
            route: '../Dashboard',
        },
    ];

    const handleLearnMore = (route) => {
        navigate(route); // Redirect to the detailed page for the respective service
    };

    return (
        <div className="service-card-container">
            {services.map((service, index) => (
                <div className="service-card" key={index}>
                    <div className="service-content">
                        {service.icon} {/* Icon representing the service */}
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <button onClick={() => handleLearnMore(service.route)} className="learn-more-btn">
                            Learn More
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceCard;
