import React, { useState } from "react";
import "./Home.css";
import Maintenance from "./Maintenance"; // Import the Maintenance component
import NoticeBoard from "./NoticeBoard";
import AdminGuestHistory from "./AdminGuestHistory";
import GuestInOut from "./GuestInOut";

const Home = () => {
  const [content, setContent] = useState({
    title: "Welcome to MyApp",
    description: "This is the main content area.",
    component: null, // Default component is null
  });

  const handleNavClick = (title, description, component = null) => {
    setContent({ title, description, component });
  };

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="logo">
          <h2>MyApp</h2>
        </div>
        <nav className="nav-links">
          <button
            className="nav-link"
            onClick={() =>
              handleNavClick("Home", "This is the home page content.")
            }
          >
            <i className="fas fa-home"></i> Home
          </button>
          <button
            className="nav-link"
            onClick={() =>
              handleNavClick(<NoticeBoard />)
            }
          >
            <i className="fas fa-user"></i> NoticeBoard
          </button>
          <button
            className="nav-link"
            onClick={() =>
              handleNavClick(
                "Maintenance",
                <Maintenance /> // Render Maintenance component
              )
            }
          >
            <i className="fas fa-tools"></i> Maintenance
          </button>
          <button
            className="nav-link"
            onClick={() =>
              handleNavClick(<GuestInOut />)
            }
          >
            <i className="fas fa-envelope"></i> In Out History
          </button>
          {/* Add other navigation items */}
        </nav>
      </aside>
      <main className="content">
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        {content.component}
      </main>
    </div>
  );
};

export default Home;
