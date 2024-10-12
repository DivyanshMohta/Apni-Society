import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComments, faPlus } from "@fortawesome/free-solid-svg-icons";
import { db, storage } from "./firebaseConfig";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import './Dashboard.css'; // Assuming separate CSS for NoticeBoard

const NoticeBoard = ({ username, userId }) => {
  const [notices, setNotices] = useState([]);
  const [noticeText, setNoticeText] = useState('');
  const [noticeImage, setNoticeImage] = useState(null);
  const [noticeImageName, setNoticeImageName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentComment, setCurrentComment] = useState({});
  const [showPostForm, setShowPostForm] = useState(false); // State to toggle form visibility

  // Fetch notices from Firestore
  const fetchNotices = async () => {
    try {
      const noticeList = [];
      const q = query(collection(db, 'notices'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      for (const docSnap of querySnapshot.docs) {
        const noticeData = docSnap.data();
        if (noticeData.imageName) {
          const imageRef = ref(storage, `noticeImages/${noticeData.imageName}`);
          const imageUrl = await getDownloadURL(imageRef);
          noticeList.push({ id: docSnap.id, ...noticeData, imageUrl });
        } else {
          noticeList.push({ id: docSnap.id, ...noticeData });
        }
      }
      setNotices(noticeList);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Handle notice submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noticeText && !noticeImage) {
      setErrorMessage("Please write something before posting.");
      return;
    } else if (noticeImage && !noticeText) {
      setErrorMessage("Please write something along with the file.");
      return;
    }

    try {
      let uploadedFileName = null;
      let fileDownloadUrl = null;
      let isImage = false;

      if (noticeImage) {
        const fileExtension = noticeImage.name.split('.').pop().toLowerCase();
        const isPdf = fileExtension === 'pdf';
        isImage = !isPdf;

        const storageRef = ref(storage, isImage
          ? `noticeImages/${noticeImage.name}_${Date.now()}`
          : `noticeDocuments/${noticeImage.name}_${Date.now()}`
        );

        await uploadBytes(storageRef, noticeImage);
        uploadedFileName = `${noticeImage.name}_${Date.now()}`;
        fileDownloadUrl = await getDownloadURL(storageRef);
      }

      const newNotice = {
        username: username || 'Anonymous',
        text: noticeText,
        agreeCount: 0,
        comments: [],
        likedBy: [],
        fileName: uploadedFileName || null,
        fileUrl: fileDownloadUrl || null,
        isImage: isImage,
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'notices'), newNotice);

      setNotices([{ id: docRef.id, ...newNotice }, ...notices]);
      setNoticeText('');
      setNoticeImage(null);
      setNoticeImageName('');
      setErrorMessage('');
      setShowPostForm(false); // Hide form after posting
    } catch (error) {
      console.error('Error adding notice:', error);
      setErrorMessage('Failed to upload. Please try again.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (validTypes.includes(file.type)) {
        setNoticeImage(file);
        setNoticeImageName(file.name);
      } else {
        setErrorMessage('Only images (JPEG, PNG) and PDFs are allowed.');
      }
    }
  };

  const handleLike = async (noticeId, likedBy) => {
    if (likedBy.includes(userId)) {
      console.log('User has already liked this notice.');
      return;
    }

    try {
      const noticeRef = doc(db, 'notices', noticeId);
      await updateDoc(noticeRef, {
        agreeCount: likedBy.length + 1,
        likedBy: arrayUnion(userId),
      });

      setNotices((prevNotices) =>
        prevNotices.map((notice) =>
          notice.id === noticeId
            ? { ...notice, agreeCount: likedBy.length + 1, likedBy: [...likedBy, userId] }
            : notice
        )
      );
    } catch (error) {
      console.error('Error liking notice:', error);
    }
  };

  return (
    <div className="notice-board">
      <h2>Notice Board</h2>

      {/* Toggle Button to Show/Hide Post Notice Form */}
      <button onClick={() => setShowPostForm((prev) => !prev)}>
        <FontAwesomeIcon icon={faPlus} /> {showPostForm ? "Hide Post Notice" : "Post Notice"}
      </button>

      {/* Conditionally Render the Post Notice Form */}
      {showPostForm && (
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Write your notice here..."
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
          />
          <div className="file-input-container">
            <label className="file-input-label">
              Choose File
              <input type="file" accept="image/*, application/pdf" onChange={handleImageUpload} />
            </label>
            {noticeImageName && <p className="file-name">{noticeImageName}</p>}
          </div>
          <button type="submit">Post Notice</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      )}

      {/* Display Notices */}
      <div className="notices-list">
        {notices.map((notice) => (
          <div key={notice.id} className="notice-item">
            <div className="notice-header">
              <strong>{notice.username}</strong>
              <span>
                {notice.timestamp && notice.timestamp.toDate
                  ? new Date(notice.timestamp.toDate()).toLocaleString()
                  : 'No timestamp available'}
              </span>
            </div>
            <div className="notice-content">
              <p>{notice.text}</p>
              {notice.isImage ? (
                <img className="notice-image" src={notice.fileUrl} alt={notice.fileName} />
              ) : (
                notice.fileUrl && (
                  <a href={notice.fileUrl} download={notice.fileName}>
                    SHOW PDF
                  </a>
                )
              )}
            </div>
            <div className="notice-footer">
              <button onClick={() => handleLike(notice.id, notice.likedBy)}>
                <FontAwesomeIcon icon={faThumbsUp} />
                {notice.agreeCount}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;
