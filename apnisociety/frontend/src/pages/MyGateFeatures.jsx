import React from 'react';
import './MyGateFeatures.css'; // Import the CSS for styling

const AboutMyGate = () => {
    // Sample content for the cards
    const cardData = [
        {
            title: "Advanced Security",
            description: "Keep your society secure with visitor management, vehicle tracking, and more advanced security features."
        },
        {
            title: "Community Hub",
            description: "Stay connected with your neighbors and society members through a seamless community hub."
        },
        {
            title: "Payment Management",
            description: "Handle all society-related payments and track your transactions easily using our platform."
        },
        {
            title: "Maintenance Tracking",
            description: "Track and request maintenance for your society with easy access to services and support."
        },
        {
            title: "Real-Time Notifications",
            description: "Receive instant updates about visitors, maintenance schedules, and society events."
        }
    ];

    return (
        <div className="about-my-gate-container">
            <h2 className="section-header">About MyGate</h2>
            <div className="card-container">
                {cardData.map((card, index) => (
                    <div key={index} className="info-card">
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutMyGate;
