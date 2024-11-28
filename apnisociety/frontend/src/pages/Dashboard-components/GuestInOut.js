// Import necessary React and Firebase modules
import React, { useState, useEffect } from "react";
import "./GuestInOut.css"; // Import the CSS for styling
import { db, storage } from "../firebaseConfig"; // Import Firebase configurations
import { collection, updateDoc, doc, onSnapshot, getDocs } from "firebase/firestore"; // Firestore methods
import { ref, getDownloadURL } from "firebase/storage"; // Firebase Storage methods
import { getAuth } from "firebase/auth"; // Firebase Auth method


const GuestInOut = () => {
  // State hooks for guest history and user's flat number
  const [guestHistory, setGuestHistory] = useState([]);
  const [flatNumber, setFlatNumber] = useState(null);

  // Fetch current user's flat number
  const fetchUserFlatNumber = async () => {
    try {
      const auth = getAuth(); // Get authentication instance
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userUid = currentUser;

        // Query to find the user's flat number from the Users collection
        const querySnapshot = await getDocs(collection(db, "Users"));
        for (const docSnap of querySnapshot.docs) {
          const userData = docSnap.data();

          // Check if the email matches and retrieve flat number
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

  // Fetch guest history when flat number is available
  useEffect(() => {
    if (flatNumber) {
      const unsubscribe = onSnapshot(collection(db, "guestHistory"), async (snapshot) => {
        const guestList = [];
  
        // Process guest data from Firestore
        for (const docSnap of snapshot.docs) {
          const guestData = docSnap.data();
          let imageUrl = null;

          // Fetch guest image from Firebase Storage if exists
          if (guestData.imageName) {
            try {
              const imageRef = ref(storage, `guestImages/${guestData.imageName}`);
              imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
              // Fallback if image not found
              if (error.code === 'storage/object-not-found') {
                console.warn(`Image not found: ${guestData.imageName}`);
                imageUrl = '/images/placeholder.jpg';
              } else {
                console.error('Error fetching image:', error);
              }
            }
          }
  
          // Only add guests matching the user's flat number
          if (guestData.flatNumber === flatNumber) {
            guestList.push({ id: docSnap.id, ...guestData, imageUrl });
          }
        }

        // Sort guest history by timestamp
        guestList.sort((a, b) => {
          const timestampA = a.timestamp?.seconds || 0;
          const timestampB = b.timestamp?.seconds || 0;
          return timestampB - timestampA;
        });
  
        setGuestHistory(guestList);
      });
  
      return () => unsubscribe(); // Cleanup listener on unmount
    }
  }, [flatNumber]);

  // Handle guest approval or rejection
  const handleApproval = async (guestId, status) => {
    try {
      const guestRef = doc(db, "guestHistory", guestId);
      await updateDoc(guestRef, { status });
    } catch (error) {
      console.error("Error updating guest status:", error);
    }
  };

  // Fetch flat number on component mount
  useEffect(() => {
    fetchUserFlatNumber();
  }, []);

  return (
    <div className="guest-in-out">
      <h2>Guest In/Out History</h2>
      <div className="guest-list">
        {guestHistory.length === 0 ? (
          <p>No guest records found.</p> // Display if no guests are found
        ) : (
          guestHistory.map((guest) => (
            <div key={guest.id} className="guest-item">
              {/* Display guest image if available */}
              {guest.imageUrl && <img src={guest.imageUrl} alt="Guest" className="guest-image" />}
              <div className="guest-info">
                {/* Display guest details */}
                <p><strong>Name:</strong> {guest.name}</p>
                <p><strong>Contact:</strong> {guest.contact}</p>
                <p><strong>Purpose:</strong> {guest.purpose}</p>
                <p><strong>Flat Number:</strong> {guest.flatNumber || "N/A"}</p>
                <p><strong>Status:</strong> {guest.status || "Pending"}</p>
                
                {/* Display approval/rejection buttons for pending guests */}
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
