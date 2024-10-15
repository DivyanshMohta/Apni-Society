// GuestInOut.js
import React, { useState, useEffect } from 'react';
import './GuestInOut.css';
import { db, storage } from '../firebaseConfig'; // Assuming you're using firebase
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

const GuestInOut = () => {
    const [guestHistory, setGuestHistory] = useState([]);

    const fetchGuestHistory = async () => {
        try {
            const guestList = [];
            const querySnapshot = await getDocs(collection(db, 'guestHistory'));
            for (const docSnap of querySnapshot.docs) {
                const guestData = docSnap.data();
                let imageUrl = null;
                
                // If the guest has an image, fetch it from Firebase Storage
                if (guestData.imageName) {
                    const imageRef = ref(storage, `guestImages/${guestData.imageName}`);
                    imageUrl = await getDownloadURL(imageRef);
                }
                
                guestList.push({ id: docSnap.id, ...guestData, imageUrl });
            }
            setGuestHistory(guestList);
        } catch (error) {
            console.error("Error fetching guest history:", error);
        }
    };

    useEffect(() => {
        fetchGuestHistory();
    }, []);

    return (
        <div className="guest-in-out">
            <h2>Guest In/Out History</h2>
            <div className="guest-list">
                {guestHistory.length === 0 ? (
                    <p>No guest records found.</p>
                ) : (
                    guestHistory.map((guest) => (
                        <div key={guest.id} className="guest-item">
                            {guest.imageUrl && <img src={guest.imageUrl} alt="Guest" className="guest-image" />}
                            <div className="guest-info">
                                <p><strong>Name:</strong> {guest.name}</p>
                                <p><strong>Contact:</strong> {guest.contact}</p>
                                <p><strong>Purpose:</strong> {guest.purpose}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GuestInOut;
