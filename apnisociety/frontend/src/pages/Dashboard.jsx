// Dashboard.js
import React, { useState } from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faConciergeBell, faUser, faCog, faClipboard } from '@fortawesome/free-solid-svg-icons';
import NoticeBoard from './Dashboard-components/noticeboard'; // Import the separated NoticeBoard component
import GuestInOut from './Dashboard-components/GuestInOut'; // Import the Guest In/Out component

const Dashboard = () => {
    const [currentComponent, setCurrentComponent] = useState('noticeBoard'); // Initial component to display

    const handleNoticeBoardClick = () => {
        setCurrentComponent('noticeBoard'); // Set current component to Notice Board
    };

    const handleGuestInOutClick = () => {
        setCurrentComponent('guestInOut'); // Set current component to Guest In/Out
    };

    const handleServicesClick = () => {
        // You can implement the services click if you have a corresponding component
        console.log("Services clicked");
    };

    const renderComponent = () => {
        switch (currentComponent) {
            case 'noticeBoard':
                return <NoticeBoard />; // Render Notice Board component
            case 'guestInOut':
                return <GuestInOut />; // Render Guest In/Out component
            default:
                return <NoticeBoard />; // Default to Notice Board
        }
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>

                <div className="dashboard-content">
                    <div className="dashboard-top">
                        <div className="feature" onClick={handleNoticeBoardClick}>
                            <FontAwesomeIcon icon={faClipboard} />
                            <span>Notice Board</span>
                        </div>

                        <div className="feature" onClick={handleGuestInOutClick}>
                            <FontAwesomeIcon icon={faSignInAlt} />
                            <span>Guest In/Out Details</span>
                        </div>

                        <div className="feature" onClick={handleServicesClick}>
                            <FontAwesomeIcon icon={faConciergeBell} />
                            <span>Services</span>
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

            <div className="main-content">
                {renderComponent()} {/* Render the currently selected component */}
            </div>
        </div>
    );
};

export default Dashboard;
