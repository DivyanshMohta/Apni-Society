import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Path to your Firebase configuration
import "./AdminGuestHistory.css"; // Import the CSS file

function AdminGuestHistory() {
  const [guestHistory, setGuestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuestHistory = async () => {
      setLoading(true);
      try {
        const guestCollection = collection(db, "guestHistory");
        const guestQuery = query(guestCollection, orderBy("timestamp", "desc"));
        const guestDocs = await getDocs(guestQuery);
  
        const guestData = guestDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Optional: Ensure the data is sorted by timestamp in descending order just in case
        guestData.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
  
        setGuestHistory(guestData);
      } catch (error) {
        console.error("Error fetching guest history:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchGuestHistory();
  }, []);
  
  return (
    <div className="admin-guest-history">
      <h1>Admin - Guest History</h1>
      {loading ? (
        <div>Loading guest history...</div>
      ) : guestHistory.length > 0 ? (
        <table className="guest-history-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Purpose</th>
              <th>Flat Number</th>
              <th>Image</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {guestHistory.map((guest) => (
              <tr key={guest.id}>
                <td>{guest.name}</td>
                <td>{guest.contact}</td>
                <td>{guest.purpose}</td>
                <td>{guest.flatNumber}</td>
                <td>
                  {guest.imageName ? (
                    <img
                      src={`path_to_image_storage/${guest.imageName}`}
                      alt={guest.name}
                      className="guest-image"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{guest.status}</td>
                <td>
                  {guest.timestamp?.toDate().toLocaleString() || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No guest history found.</div>
      )}
    </div>
  );
}

export default AdminGuestHistory;
