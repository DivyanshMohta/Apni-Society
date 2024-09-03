import React, { useState } from 'react';
import './Dashboard.css'; // Ensure this path matches your directory structure
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faConciergeBell, faUser, faCog } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const [showSubMenu, setShowSubMenu] = useState(false);

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
            </div>
            <div className="dashboard-content">
                <div className="dashboard-top">
                    <div className="feature">
                        <FontAwesomeIcon icon={faSignInAlt} />
                        <span>Guest In/Out Details</span>
                    </div>
                    <div className="feature" onClick={toggleSubMenu}>
                        <FontAwesomeIcon icon={faConciergeBell} />
                        <span>Services</span>
                        {showSubMenu && (
                            <div className="sub-menu">
                                <a href="#">Vegetable Vendors</a>
                                <a href="#">Parking Services</a>
                                <a href="#">Laundry</a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="dashboard-bottom">
                    <div className="profile-icon">
                        <FontAwesomeIcon icon={faUser} />
                        <span>Profile</span>
                    </div>
                    <div className="settings-icon">
                        <FontAwesomeIcon icon={faCog} />
                        <span>Settings</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
