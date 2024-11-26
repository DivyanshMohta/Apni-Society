import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faConciergeBell,
  faUser,
  faCog,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css"; // Dashboard specific styling

const Dashboard = () => {
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false); // For future sub-menu functionality

  // Toggle submenu functionality
  const toggleSubMenu = () => setShowSubMenu((prev) => !prev);

  // Handle navigation for the Maintenance component
  const handleMaintenanceClick = () => {
    navigate("/maintenance"); // Navigate to the Maintenance route
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-top">
            <div className="feature" onClick={() => navigate("/noticeboard")}>
              <FontAwesomeIcon icon={faClipboard} />
              <p>Notice Board</p>
            </div>
            <div className="feature" onClick={() => navigate("/guestinout")}>
              <FontAwesomeIcon icon={faSignInAlt} />
              <p>Guest In/Out</p>
            </div>
            <div className="feature" onClick={handleMaintenanceClick}>
              <FontAwesomeIcon icon={faConciergeBell} />
              <p>Maintenance</p>
            </div>
            <div className="feature" onClick={() => navigate("/services")}>
              <FontAwesomeIcon icon={faCog} />
              <p>Services</p>
            </div>
            <div className="feature" onClick={() => navigate("/userprofile")}>
              <FontAwesomeIcon icon={faUser} />
              <p>User Profile</p>
            </div>
          </div>

          {showSubMenu && (
            <div className="submenu">
              <p>Account Settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
