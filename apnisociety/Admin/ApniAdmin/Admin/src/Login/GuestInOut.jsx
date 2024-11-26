  import React, { useState, useEffect } from "react";
  import "./GuestInOut.css";
  import { db, storage } from "../firebaseConfig";
  import { collection, updateDoc, doc, onSnapshot } from "firebase/firestore";
  import { ref, getDownloadURL } from "firebase/storage";

  const GuestInOut = () => {
    const [guestHistory, setGuestHistory] = useState([]);

    // Fetch guest history
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "guestHistory"), async (snapshot) => {
        const guestList = [];
        for (const docSnap of snapshot.docs) {
          const guestData = docSnap.data();
          let imageUrl = null;

          // Fetch image URL if available
          if (guestData.imageName) {
            try {
              const imageRef = ref(storage, `guestImages/${guestData.imageName}`);
              imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
              imageUrl = "/images/placeholder.jpg";
            }
          }

          // Add guest data to the list
          guestList.push({ id: docSnap.id, ...guestData, imageUrl });
        }

        // Sort the guest list by timestamp (newest to oldest)
        guestList.sort((a, b) => b.timestamp - a.timestamp);
        setGuestHistory(guestList);
      });

      return () => unsubscribe();
    }, []);

    // Handle approval or rejection of a guest
    const handleApproval = async (guestId, status) => {
      try {
        const guestRef = doc(db, "guestHistory", guestId);
        await updateDoc(guestRef, { status });
      } catch (error) {
        console.error("Error updating guest status:", error);
      }
    };

    return (
      <div className="guest-in-out">
        <h2>Guest In/Out History</h2>
        <div className="guest-list">
          {guestHistory.length === 0 ? (
            <p>No guest records found.</p>
          ) : (
            guestHistory.map((guest) => (
              // Inside the guest-item rendering loop

<div key={guest.id} className="guest-item">
  {guest.imageUrl && <img src={guest.imageUrl} alt="Guest" className="guest-image" />}
  <div className="guest-info">
    {/* Top row (Name and Contact) */}
    <div className="top-row">
      <p><strong>Name:</strong> {guest.name}</p>
      <p><strong>Contact:</strong> {guest.contact}</p>
    </div>
    
    {/* Bottom row (Flat No and Status) */}
    <div className="bottom-row">
      <p><strong>Flat Number:</strong> {guest.flatNumber || "N/A"}</p>
      <p><strong>Status:</strong> <span className={`status ${guest.status ? guest.status.toLowerCase() : "pending"}`}>{guest.status || "Pending"}</span></p>
    </div>
  </div>
</div>

            ))
          )}
        </div>
      </div>
    );
  };

  export default GuestInOut;
