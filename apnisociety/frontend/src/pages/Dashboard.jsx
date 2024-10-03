// Dashboard.js
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faConciergeBell, faUser, faCog, faClipboard, faThumbsUp, faComments } from '@fortawesome/free-solid-svg-icons';
import Profile from '../Images/profile_icon.png';
import { db, storage } from './firebaseConfig';
import { collection, getDocs, updateDoc, doc, addDoc, serverTimestamp, query, orderBy, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from "firebase/auth";  

const Dashboard = () => {
    const navigate = useNavigate(); 
    const [notices, setNotices] = useState([]);
    const [noticeText, setNoticeText] = useState('');
    const [noticeImage, setNoticeImage] = useState(null);
    const [noticeImageName, setNoticeImageName] = useState(''); // State to hold the image filename
    const [showNoticeForm, setShowNoticeForm] = useState(false); // State for toggling notice form
    const [showSubMenu, setShowSubMenu] = useState(false); // State for submenu toggle
    const [errorMessage, setErrorMessage] = useState(''); // To display an error when only an image is posted
    const [currentComment, setCurrentComment] = useState({});
    const [username, setUsername] = useState(''); // State for the username
    const [commentVisibility, setCommentVisibility] = useState({}); 

    const auth = getAuth(); // Initialize Firebase Auth

    // Function to fetch user data from Firestore based on uid
    const fetchUsername = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'Users', uid));
            if (userDoc.exists()) {
                setUsername(userDoc.data().username); // Set the username from Firestore
            } else {
                console.log("No such user document!");
            }
        } catch (error) {
            console.error("Error fetching username:", error);
        }
    };

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in, get user details
                fetchUsername(user.uid); // Fetch username based on the user ID
            } else {
                console.log("No user is logged in.");
                setUsername(''); // Clear username if no user is logged in
            }
        });

        return () => unsubscribe(); // Clean up the listener on component unmount
    }, []);

    const parseTimestamp = (timestamp) => {
        const [day, month, yearTime] = timestamp.split('-');
        const [monthPart, year] = [month, yearTime.split(' ')[0]];
        const [hours, minutes] = yearTime.split(' ')[1].split(':');
        return new Date(year, month - 1, day, hours, minutes);
    };

    const fetchNotices = async () => {
        try {
            const noticeList = [];
            const q = query(collection(db, 'notices'));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No notices found.");
            } else {
                for (const docSnap of querySnapshot.docs) {
                    const noticeData = docSnap.data();
                    const timestamp = noticeData.timestamp ? parseTimestamp(noticeData.timestamp) : new Date(8640000000000000); // Default far-future date

                    if (noticeData.imageName) {
                        const imageRef = ref(storage, `noticeImages/${noticeData.imageName}`);
                        const imageUrl = await getDownloadURL(imageRef);
                        noticeList.push({ id: docSnap.id, ...noticeData, imageUrl, timestamp });
                    } else {
                        noticeList.push({ id: docSnap.id, ...noticeData, timestamp });
                    }
                }
                noticeList.sort((a, b) => b.timestamp - a.timestamp);
                setNotices(noticeList);
            }
        } catch (error) {
            console.error("Error fetching notices:", error);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!noticeText && !noticeImage) {
            setErrorMessage('Please write something before posting.');
            return;
        } else if (noticeImage && !noticeText) {
            setErrorMessage('Please write something along with the image.');
            return;
        }
    
        try {
            // Variable to hold the image URL
            let imageUrl = null;
    
            // Upload image to Firebase Storage if present
            if (noticeImage) {
                const imageName = `${noticeImage.name}_${Date.now()}`; // Generate unique filename
                const storageRef = ref(storage, `noticeImages/${imageName}`);
                
                // Upload the image and get its URL
                const snapshot = await uploadBytes(storageRef, noticeImage);
                imageUrl = await getDownloadURL(snapshot.ref); // Get the URL of the uploaded image
            }
    
            // Add new notice to Firestore
            const newNotice = {
                username: username || 'Anonymous', // Use fetched username or default to 'Anonymous'
                text: noticeText,
                agreeCount: 0,
                comments: [],
                imageUrl: imageUrl || null, // Store image URL if uploaded
                timestamp: serverTimestamp()
            };
    
            const docRef = await addDoc(collection(db, 'notices'), newNotice);
            console.log("Document written with ID: ", docRef.id);
    
            // Update the local state with the new notice
            const updatedNotice = { id: docRef.id, ...newNotice, imageUrl, timestamp: new Date() };
            setNotices([updatedNotice, ...notices]);
    
            // Reset form fields
            setNoticeText('');
            setNoticeImage(null);
            setNoticeImageName('');
            setErrorMessage('');
        } catch (error) {
            console.error("Error adding new notice:", error);
        }
    };
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNoticeImage(file);
            setNoticeImageName(file.name);
        }
    };

    const handleAgree = async (noticeId, currentAgreeCount) => {
        const newAgreeCount = currentAgreeCount + 1;
        const noticeRef = doc(db, 'notices', noticeId);

        // Update Firestore with new agree count
        await updateDoc(noticeRef, {
            agreeCount: newAgreeCount
        });

        // Update state locally
        setNotices(prevNotices =>
            prevNotices.map(notice =>
                notice.id === noticeId ? { ...notice, agreeCount: newAgreeCount } : notice
            )
        );
    };

    const toggleNoticeForm = () => {
        setShowNoticeForm(!showNoticeForm); // Toggle the form visibility
    };

    const toggleSubMenu = () => setShowSubMenu(prev => !prev);

    const handleCommentSubmit = async (e, noticeId) => {
        e.preventDefault();
        const newComment = currentComment[noticeId];
        if (!newComment) return;

        try {
            const noticeRef = doc(db, 'notices', noticeId);
            const noticeDoc = await getDoc(noticeRef);
            const existingComments = noticeDoc.data().comments || [];

            const updatedComments = [...existingComments, { username: username || 'Anonymous', commentText: newComment }];

            await updateDoc(noticeRef, {
                comments: updatedComments
            });

            // Update state locally
            setNotices(prevNotices =>
                prevNotices.map(notice =>
                    notice.id === noticeId
                        ? { ...notice, comments: updatedComments }
                        : notice
                )
            );

            setCurrentComment({ ...currentComment, [noticeId]: '' });
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleCommentChange = (e, noticeId) => {
        setCurrentComment({ ...currentComment, [noticeId]: e.target.value });
    };

    const handleGuestInOutClick = () => {
        navigate('/GuestInOut');  // Navigate to the guest in/out page
    };

    return (
        <div className="dashboard-page">
            
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>

                <div className="dashboard-content">
                    
                    <div className="dashboard-top">
                        <div className="feature" onClick={toggleNoticeForm}>
                            <FontAwesomeIcon icon={faClipboard} />
                            <span>Notice Board</span>
                        </div>

                        <div className="feature" onClick={handleGuestInOutClick}>
                            <FontAwesomeIcon icon={faSignInAlt} />
                            <span>Guest In/Out Details</span>
                        </div>  
                    <div className={`feature ${showSubMenu ? 'show-submenu' : ''}`} onClick={toggleSubMenu}>
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
                                placeholder="Write your notice here..."
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
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button type="submit" className="button-primary">Post</button>
                        </form>
                    )}

                    <div className="posted-notices">
                        {notices.map((notice) => (
                            <div key={notice.id} className="notice-item">
                                <div className="posted_profile">
                                    <img src={Profile} alt="Profile" /> {/* You can replace this with user's profile picture */}
                                    <span className="profile-name">{notice.username}</span>
                                </div>
                                <div className="notice-content">
                                    {notice.imageUrl && <img src={notice.imageUrl} alt="Notice" />}
                                    <p>{notice.text}</p>
                                </div>
                                <div className="notice-actions">
                                    <FontAwesomeIcon
                                        icon={faThumbsUp}
                                        className="like-icon"
                                        onClick={() => handleAgree(notice.id, notice.agreeCount || 0)}
                                    />
                                    <span className="like-text">Agree ({notice.agreeCount || 0})</span>
                                    <FontAwesomeIcon
                                        icon={faComments}
                                        className="comment-icon"
                                    />
                                    <span className="comment-text">Comment</span>
                                </div>
                                <div className="comments-section">
                                    {notice.comments && notice.comments.length > 0 && (
                                        <div className="comments-list">
                                            {notice.comments.map((comment, index) => (
                                                <div key={index} className="comment-item">
                                                    <strong>{comment.username}</strong>: {comment.commentText}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <form onSubmit={(e) => handleCommentSubmit(e, notice.id)}>
                                        <textarea
                                            placeholder="Add a comment..."
                                            value={currentComment[notice.id] || ''}
                                            onChange={(e) => handleCommentChange(e, notice.id)}
                                        />
                                        <button type="submit" className="button-primary">Add Comment</button>
                                    </form>
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
