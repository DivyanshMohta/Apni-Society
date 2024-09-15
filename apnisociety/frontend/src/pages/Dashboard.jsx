import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faConciergeBell, faUser, faCog, faClipboard, faThumbsUp, faComments } from '@fortawesome/free-solid-svg-icons';
import Profile from '../Images/profile_icon.png'
import { db, storage } from './firebaseConfig';
import { collection, getDocs, updateDoc, doc, addDoc, serverTimestamp, query, orderBy, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

const Dashboard = () => {
    const [notices, setNotices] = useState([]);
    const [noticeText, setNoticeText] = useState('');
    const [noticeImage, setNoticeImage] = useState(null);
    const [noticeImageName, setNoticeImageName] = useState(''); // State to hold the image filename
    const [showNoticeForm, setShowNoticeForm] = useState(false); // State for toggling notice form
    const [showSubMenu, setShowSubMenu] = useState(false); // State for submenu toggle
    const [errorMessage, setErrorMessage] = useState(''); // To display an error when only an image is posted
    const [currentComment, setCurrentComment] = useState({});

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
          console.log("Fetched notices:", querySnapshot.docs.map(doc => doc.data()));
    
          for (const doc of querySnapshot.docs) {
            const noticeData = doc.data();
            const timestamp = noticeData.timestamp ? parseTimestamp(noticeData.timestamp) : new Date(8640000000000000); // Default far-future date
    
            if (noticeData.imageName) {
              const imageRef = ref(storage, `noticeImages/${noticeData.imageName}`);
              const imageUrl = await getDownloadURL(imageRef);
              noticeList.push({ id: doc.id, ...noticeData, imageUrl, timestamp });
            } else {
              noticeList.push({ id: doc.id, ...noticeData, timestamp });
            }
          }
    
          noticeList.sort((a, b) => b.timestamp - a.timestamp);
          console.log("Sorted notices:", noticeList);
    
          setNotices(noticeList);
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    useEffect(() => {
      fetchNotices();
    }, []);

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     if (!noticeText && !noticeImage) {
    //         setErrorMessage('Please write something before posting.');
    //         return;
    //     } else if (noticeImage && !noticeText) {
    //         setErrorMessage('Please write something along with the image.');
    //         return;
    //     }

    //     // Add new notice at the beginning of the array
    //     // setNotices([{ text: noticeText, image: noticeImage }, ...notices]);
    //     // setNoticeText('');
    //     // setNoticeImage(null); // Reset the input fields
    //     // setNoticeImageName(''); // Reset the filename
    //     // setErrorMessage(''); // Reset error

    //     setNoticeText('');
    //     setNoticeImage(null);
    //     setNoticeImageName('');
    //     setErrorMessage('');
    // };


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
    // Step 1: Add the new notice to Firestore (without the ID field initially)
      const newNotice = {
        text: noticeText,
        agreeCount: 0,
        comments: [],
        imageName: noticeImageName || null, // Store image name if uploaded
        time: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'notices'), newNotice);  // Firestore generates the ID here
      console.log("Document written with ID: ", docRef.id);

    // Step 2: Update the same document with the Firestore-generated ID
      await updateDoc(docRef, { id: docRef.id });

    // Update local state with the new notice and reset fields
      const updatedNotice = { id: docRef.id, ...newNotice, imageUrl: noticeImage };
      setNotices([updatedNotice, ...notices]);
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
            // setNoticeImage(URL.createObjectURL(file));
            // setNoticeImageName(file.name); // Update the filename state
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
    
      const noticeRef = doc(db, 'notices', noticeId);
      const noticeDoc = await getDoc(noticeRef);
      const existingComments = noticeDoc.data().comments || [];
    
      await updateDoc(noticeRef, {
        comments: [...existingComments, { username: 'Anonymous', commentText: newComment }]
      });
    
      setNotices(prevNotices =>
        prevNotices.map(notice =>
          notice.id === noticeId
            ? { ...notice, comments: [...existingComments, { username: 'Anonymous', commentText: newComment }] }
            : notice
        )
      );
    
      setCurrentComment({ ...currentComment, [noticeId]: '' });
    };
  
    const handleCommentChange = (e, noticeId) => {
      setCurrentComment({ ...currentComment, [noticeId]: e.target.value });
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
    
                <div className="feature">
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Guest In/Out Details</span>
                </div>
    
                <div className="feature" onClick={toggleNoticeForm}>
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
                  <button type="submit" className="button-primary">Post</button>
                </form>
              )}

              {errorMessage && <p className="error-message">{errorMessage}</p>}
            
              <div className="posted-notices">
                {notices.map((notice) => (
                  <div key={notice.id} className="notice-item">
                    <div className="posted_profile">
                      <img src={Profile} alt="Profile" /> {/* Add a valid profile image source */}
                      <span className="profile-name">{notice.userName}</span>
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
                        onClick={() => handleCommentSubmit(notice.id)}
                      />
                      <span className="comment-text">Comment</span>
                    </div>
                    <div className="comments-section">
                    {notice.comments && notice.comments.length > 0 && (
                      <div className="comments-section">
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
