import React, { useState, useEffect } from "react";
import "./SecurityInOut.css";
import { db, storage } from "./firebaseConfig"; // Import Firebase configuration
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { serverTimestamp } from "firebase/firestore"; // Import serverTimestamp

const SecurityInOut = () => {
  const [guestName, setGuestName] = useState("");
  const [contact, setContact] = useState("");
  const [purpose, setPurpose] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [image, setImage] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" }); // Updated for toast messages
  const [guestRequests, setGuestRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending"); // Manage active tab

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Real-time listener to fetch guest requests sorted by timestamp
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "guestHistory"), orderBy("timestamp", "desc")), // Sort by timestamp
      (snapshot) => {
        const guests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGuestRequests(guests);
      }
    );

    return () => unsubscribe();
  }, []);

  // Validate contact number
  const validateContact = (number) => {
    const contactRegex = /^\d{10}$/; // Regular expression to check for exactly 10 digits
    return contactRegex.test(number);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the contact number
    if (!validateContact(contact)) {
      setNotification({ message: "Please enter a valid 10-digit contact number.", type: "error" });
      return;
    }

    try {
      const guestDocRef = await addDoc(collection(db, "guestHistory"), {
        name: guestName,
        contact,
        purpose,
        flatNumber,
        imageName: image ? image.name : null,
        status: "Pending",
        timestamp: serverTimestamp(), // Add timestamp here
      });

      if (image) {
        const imageRef = ref(storage, `guestImages/${image.name}`);
        await uploadBytes(imageRef, image);
      }

      setNotification({ message: "Guest entry added successfully!", type: "success" });
      setGuestName("");
      setContact("");
      setPurpose("");
      setFlatNumber("");
      setImage(null);
    } catch (error) {
      setNotification({ message: "An error occurred while adding the guest entry.", type: "error" });
      console.error("Error adding guest entry:", error);
    }
  };

  // Automatically clear notification after 3 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter requests based on the active tab
  const filteredRequests =
    activeTab === "pending"
      ? guestRequests.filter((guest) => guest.status === "Pending")
      : guestRequests.filter((guest) => guest.status !== "Pending");

  return (
    <div className="security-in-out">
      {/* Toast notification */}
      {notification.message && (
        <div className={`toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h2>Security In/Out Management</h2>

      {/* Form for adding a new guest entry */}
      <form onSubmit={handleSubmit} className="guest-form">
        <input
          type="text"
          placeholder="Guest Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Purpose of Visit"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Flat Number"
          value={flatNumber}
          onChange={(e) => setFlatNumber(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Add Guest Entry</button>
      </form>

      {/* Tabs for Pending Requests and History */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </button>
        <button
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* Guest Requests Section */}
      <div className="guest-requests-list">
        {filteredRequests.length === 0 ? (
          <p>No guest requests found in this category.</p>
        ) : (
          filteredRequests.map((guest) => (
            <div key={guest.id} className="guest-request-item">
              <p>
                <strong>Name:</strong> {guest.name}
              </p>
              <p>
                <strong>Contact:</strong> {guest.contact}
              </p>
              <p>
                <strong>Purpose:</strong> {guest.purpose}
              </p>
              <p>
                <strong>Flat Number:</strong> {guest.flatNumber}
              </p>
              <p>
                <strong>Status:</strong> {guest.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SecurityInOut;
