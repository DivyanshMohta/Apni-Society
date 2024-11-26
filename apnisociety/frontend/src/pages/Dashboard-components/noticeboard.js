// NoticeBoard.js
import React, { useState, useEffect } from 'react';
import './noticeboard.css';
import { collection, getDocs, updateDoc, doc, addDoc, serverTimestamp, query,getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComments } from '@fortawesome/free-solid-svg-icons';
import Profile from '../../Images/profile_icon.png';

const NoticeBoard = ({ username }) => {
    const [notices, setNotices] = useState([]);
    const [noticeText, setNoticeText] = useState('');
    const [noticeImage, setNoticeImage] = useState(null);
    const [noticeImageName, setNoticeImageName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentComment, setCurrentComment] = useState({});

    useEffect(() => {
        fetchNotices();
    }, []);

    // const fetchNotices = async () => {
    //     try {
    //         const noticeList = [];
    //         const q = query(collection(db, 'notices'));
    //         const querySnapshot = await getDocs(q);

    //         for (const docSnap of querySnapshot.docs) {
    //             const noticeData = docSnap.data();
    //             let imageUrl = null;
    //             if (noticeData.imageName) {
    //                 const imageRef = ref(storage, `noticeImages/${noticeData.imageName}`);
    //                 imageUrl = await getDownloadURL(imageRef);
    //             }
    //             noticeList.push({ id: docSnap.id, ...noticeData, imageUrl });
    //         }
    //         noticeList.sort((a, b) => b.timestamp - a.timestamp);
    //         setNotices(noticeList);
    //     } catch (error) {
    //         console.error("Error fetching notices:", error);
    //     }
    // };

    const fetchNotices = async () => {
        try {
            const noticeList = [];
            const q = query(collection(db, 'notices'));
            const querySnapshot = await getDocs(q);
    
            for (const docSnap of querySnapshot.docs) {
                const noticeData = docSnap.data();
                let imageUrl = null;
                if (noticeData.imageName) {
                    const imageRef = ref(storage, `noticeImages/${noticeData.imageName}`);
                    imageUrl = await getDownloadURL(imageRef);
                }
                console.log(noticeList);
                noticeList.push({ id: docSnap.id, ...noticeData, imageUrl });
            }
            noticeList.sort((a, b) => b.timestamp - a.timestamp);
            setNotices(noticeList);
        } catch (error) {
            console.error("Error fetching notices:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!noticeText && !noticeImage) {
            setErrorMessage('Please write something before posting.');
            return;
        }

        try {
            let imageUrl = null;
            if (noticeImage) {
                const imageName = `${noticeImage.name}_${Date.now()}`;
                const storageRef = ref(storage, `noticeImages/${imageName}`);
                await uploadBytes(storageRef, noticeImage);
                imageUrl = await getDownloadURL(storageRef);
            }

            const newNotice = {
                username: username || 'Anonymous',
                text: noticeText,
                agreeCount: 0,
                comments: [],
                imageUrl: imageUrl || null,
                timestamp: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, 'notices'), newNotice);
            setNotices([{ id: docRef.id, ...newNotice, timestamp: new Date() }, ...notices]);
            setNoticeText('');
            setNoticeImage(null);
            setNoticeImageName('');
            setErrorMessage('');
        } catch (error) {
            console.error("Error adding new notice:", error);
        }
    };

    // const handleAgree = async (noticeId, currentAgreeCount) => {
    //     const newAgreeCount = currentAgreeCount + 1;
    //     const noticeRef = doc(db, 'notices', noticeId);
    //     await updateDoc(noticeRef, { agreeCount: newAgreeCount });
    //     setNotices(prevNotices =>
    //         prevNotices.map(notice =>
    //             notice.id === noticeId ? { ...notice, agreeCount: newAgreeCount } : notice
    //         )
    //     );
    // };

    const handleAgree = async (noticeId, currentAgreeCount) => {
        const userId = "currentUserId"; // Replace with actual user ID from authentication context
        const noticeRef = doc(db, 'notices', noticeId);
    
        try {
            const noticeSnapshot = await getDoc(noticeRef);
    
            if (!noticeSnapshot.exists()) {
                console.error(`Notice with ID ${noticeId} does not exist`);
                return;
            }
    
            const noticeData = noticeSnapshot.data();
    
            // Ensure fields have default values
            const currentAgreeList = noticeData.agreeList || [];
            const currentAgreeCountSafe = noticeData.agreeCount ?? 0;
    
            // Check if the user has already agreed
            const hasAgreed = currentAgreeList.includes(userId);
    
            let updatedAgreeList;
            let updatedAgreeCount;
    
            if (hasAgreed) {
                // User is removing their agreement
                updatedAgreeList = currentAgreeList.filter(id => id !== userId);
                updatedAgreeCount = Math.max(currentAgreeCountSafe - 1, 0); // Prevent negative count
            } else {
                // User is adding their agreement
                updatedAgreeList = [...currentAgreeList, userId];
                updatedAgreeCount = currentAgreeCountSafe + 1;
            }
    
            // Validate fields before updating Firestore
            if (updatedAgreeCount === undefined || !Array.isArray(updatedAgreeList)) {
                console.error("Invalid data: agreeCount or agreeList is undefined");
                return;
            }
    
            // Update Firestore document
            await updateDoc(noticeRef, {
                agreeCount: updatedAgreeCount,
                agreeList: updatedAgreeList,
            });
    
            // Update local state
            setNotices(prevNotices =>
                prevNotices.map(notice =>
                    notice.id === noticeId
                        ? { ...notice, agreeCount: updatedAgreeCount }
                        : notice
                )
            );
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };
    
    
    

    const handleCommentSubmit = async (e, noticeId) => {
        e.preventDefault();
        const newComment = currentComment[noticeId];
        if (!newComment) return;

        try {
            const noticeRef = doc(db, 'notices', noticeId);
            const noticeDoc = await getDoc(noticeRef);
            const updatedComments = [...(noticeDoc.data().comments || []), { username: username || 'Anonymous', commentText: newComment }];

            await updateDoc(noticeRef, { comments: updatedComments });

            setNotices(prevNotices =>
                prevNotices.map(notice =>
                    notice.id === noticeId ? { ...notice, comments: updatedComments } : notice
                )
            );
            setCurrentComment({ ...currentComment, [noticeId]: '' });
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setNoticeImage(file);
        setNoticeImageName(file ? file.name : '');
    };

    return (
        <div className="notice-board">
            <h2>Notice Board</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Write your notice here..."
                    value={noticeText}
                    onChange={(e) => setNoticeText(e.target.value)}
                />
                <div className="file-input-container">
                    <label>
                        Choose File
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    {noticeImageName && <p className="file-name">{noticeImageName}</p>}
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="button-primary">Post</button>
            </form>
            <div className="posted-notices">
                {notices.map((notice) => (
                    <div key={notice.id} className="notice-item">
                        <div className="posted_profile">
                            <img src={Profile} alt="Profile" />
                            <span>{notice.username}</span>
                        </div>
                        <div className="notice-content">
                            {notice.imageUrl && <img src={notice.imageUrl} alt="Notice" />}
                            <p>{notice.text}</p>
                        </div>
                        <div className="notice-actions">
                            <FontAwesomeIcon icon={faThumbsUp} onClick={() => handleAgree(notice.id, notice.agreeCount || 0)} />
                            <span>Agree ({notice.agreeCount || 0})</span>
                            <FontAwesomeIcon icon={faComments} />
                            <span>Comment</span>
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
                                    onChange={(e) => setCurrentComment({ ...currentComment, [notice.id]: e.target.value })}
                                />
                                <button type="submit" className="button-primary">Add Comment</button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoticeBoard;
