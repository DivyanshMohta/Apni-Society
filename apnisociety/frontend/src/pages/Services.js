import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Services.css";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    { title: "Cleaning", description: "Schedule and manage cleaning services." },
    { title: "Plumbing", description: "Request plumbing services for your unit." },
    { title: "Electrician", description: "Get help with electrical issues." },
    { title: "Gardening", description: "Book a gardener for your lawn care." },
    { title: "Grocery", description: "Order groceries and get them delivered." },
    { title: "Kirana Store", description: "Order daily essentials from the local Kirana store." }, // Add Kirana Store service
  ];

  const handleServiceClick = (serviceTitle) => {
    if (serviceTitle === "Grocery") {
      navigate("/grocery"); // Navigate to Grocery page
    } else if (serviceTitle === "Kirana Store") {
      navigate("/kirana-store"); // Navigate to Kirana Store page
    }
    // Add other service navigation if needed
  };

  return (
    <div className="services-section">
      <h2>Services</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card" onClick={() => handleServiceClick(service.title)}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <button className="service-btn">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services
