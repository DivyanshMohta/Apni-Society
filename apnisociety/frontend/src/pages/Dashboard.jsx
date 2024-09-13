import React, { useState } from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faConciergeBell, faUser, faCog, faClipboard, faThumbsUp, faComments } from '@fortawesome/free-solid-svg-icons';
import Profile from '../Images/profile_icon.png'


const Dashboard = () => {
    const [notices, setNotices] = useState([]);
    const [noticeText, setNoticeText] = useState('');
    const [noticeImage, setNoticeImage] = useState(null);
    const [noticeImageName, setNoticeImageName] = useState(''); // State to hold the image filename
    const [showNoticeForm, setShowNoticeForm] = useState(false); // State for toggling notice form
    const [showSubMenu, setShowSubMenu] = useState(false); // State for submenu toggle
    const [errorMessage, setErrorMessage] = useState(''); // To display an error when only an image is posted

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!noticeText && !noticeImage) {
            setErrorMessage('Please write something before posting.');
            return;
        } else if (noticeImage && !noticeText) {
            setErrorMessage('Please write something along with the image.');
            return;
        }

        // Add new notice at the beginning of the array
        setNotices([{ text: noticeText, image: noticeImage }, ...notices]);
        setNoticeText('');
        setNoticeImage(null); // Reset the input fields
        setNoticeImageName(''); // Reset the filename
        setErrorMessage(''); // Reset error
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNoticeImage(URL.createObjectURL(file));
            setNoticeImageName(file.name); // Update the filename state
        }
    };

    const toggleNoticeForm = () => {
        setShowNoticeForm(!showNoticeForm); // Toggle the form visibility
    };

    const toggleSubMenu = () => setShowSubMenu(prev => !prev);


    return (
        <div className="dashboard-page">
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>

                <div className="dashboard-content">
                    <div className="dashboard-top">
                        {/* Notice Board Feature */}
                        <div className="feature" onClick={toggleNoticeForm}>
                            <FontAwesomeIcon icon={faClipboard} />
                            <span>Notice Board</span>
                        </div>

                        <div className="feature">
                            <FontAwesomeIcon icon={faSignInAlt} />
                            <span>Guest In/Out Details</span>
                        </div>

                        <div className="feature" aria-label="Notice Board" onClick={toggleNoticeForm}>

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

            <div className="main-content">
                <div className="notice-board">
                    <h2>Notice Board</h2>
                    {showNoticeForm && (
                        <form onSubmit={handleSubmit}>
                            <textarea
                                placeholder="Write your complaint here..."
                                value={noticeText}
                                onChange={(e) => setNoticeText(e.target.value)}
                            />
                        <div className="file-input-container">
                        <label className="file-input-label">
                            Choose File
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        {noticeImageName && <p className="file-name">{noticeImageName}</p>}
                    </div>

                            <button type="submit" className="button-primary">Post</button>
                        </form>
                    )}

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className="posted-notices">
                        {notices.map((notice, index) => (
                            <div key={index} className="notice-item">
                            <div className="posted_profile">
                                <img src={Profile} alt="Profile" /> {/* Add a valid profile image source */}
                                <span className="profile-name">John Doe</span>
                            </div>
                            <div className="notice-content"> {/* New wrapper for text and uploaded image */}
                                {notice.image && <img src={notice.image} alt="Uploaded" />}
                                <p>{notice.text}</p>
                            </div>
                            <div className="notice-actions">
                            <FontAwesomeIcon icon={faThumbsUp} className="like-icon" />
                            <span className="like-text">Agree</span>
                            <FontAwesomeIcon icon={faComments} className="comment-icon" />
                            <span className="comment-text">Comment</span>
                        </div>
                        </div>
                        
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
