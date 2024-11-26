import React, { useState, useEffect } from "react";
import "./GuestInOut.css";
import { db, storage } from "../firebaseConfig"; // Assuming you have the configuration in firebaseConfig.js
import { collection, updateDoc, doc, onSnapshot, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";


const GuestInOut = () => {
  const [guestHistory, setGuestHistory] = useState([]);
  const [flatNumber, setFlatNumber] = useState(null);

  // Fetch flat number of the current user
  const fetchUserFlatNumber = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userUid = currentUser;

        // Fetch the specific user document by UID
        const querySnapshot = await getDocs(collection(db, "Users"));

        for (const docSnap of querySnapshot.docs) {
          const userData = docSnap.data();

          // Check if the current user's UID matches the document UID
          if (userData.email === userUid.email && userData.flatNo) {
            setFlatNumber(userData.flatNo);
            break;
          }
        }
      } else {
        console.error("No user is currently logged in.");
      }
    } catch (error) {
      console.error("Error fetching user's flat number:", error);
    }
  };

  // Real-time listener for guest history
  useEffect(() => {
    if (flatNumber) {
      const unsubscribe = onSnapshot(collection(db, "guestHistory"), async (snapshot) => {
        const guestList = [];
  
        for (const docSnap of snapshot.docs) {
          const guestData = docSnap.data();
          let imageUrl = null;
  
          // Fetch the guest's image if it exists
          if (guestData.imageName) {
            try {
              const imageRef = ref(storage, `guestImages/${guestData.imageName}`);
              imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
              if (error.code === 'storage/object-not-found') {
                console.warn(`Image not found: ${guestData.imageName}`);
                imageUrl = '/images/placeholder.jpg'; // Replace with the path to your placeholder image
              } else {
                console.error('Error fetching image:', error);
              }
            }
          }
  
          if (guestData.flatNumber === flatNumber) {
            guestList.push({ id: docSnap.id, ...guestData, imageUrl });
          }
        }
  
        // Sort the guest list by timestamp (newest to oldest)
        guestList.sort((a, b) => {
          // First, try to sort by timestamp
          const timestampA = a.timestamp?.seconds || 0;
          const timestampB = b.timestamp?.seconds || 0;
  
          // Sort by timestamp in descending order (newest first)
          return timestampB - timestampA;
        });
  
        setGuestHistory(guestList);
      });
  
      return () => unsubscribe();
    }
  }, [flatNumber]);
  

  // Handle approval or rejection of guest
  const handleApproval = async (guestId, status) => {
    try {
      const guestRef = doc(db, "guestHistory", guestId);
      await updateDoc(guestRef, { status });
    } catch (error) {
      console.error("Error updating guest status:", error);
    }
  };

  // Fetch the flat number on initial load
  useEffect(() => {
    fetchUserFlatNumber();
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
                <p><strong>Flat Number:</strong> {guest.flatNumber || "N/A"}</p>
                <p><strong>Status:</strong> {guest.status || "Pending"}</p>
                
                {guest.status === "Pending" && (
                  <div>
                    <button onClick={() => handleApproval(guest.id, "Approved")}>Approve</button>
                    <button onClick={() => handleApproval(guest.id, "Rejected")}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuestInOut;