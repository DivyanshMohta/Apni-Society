import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./ElectricianAdmin.css";

const ElectricianAdmin = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending"); // Track the active tab

  useEffect(() => {
    // Fetch appointments from Firestore
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "electricianAppointments"));
        const appointmentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(
          appointmentsData.sort((a, b) => {
            const dateA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const dateB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return dateB - dateA; // Sort by most recent
          })
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Function to handle appointment status update
  const handleStatusChange = async (id, status) => {
    try {
      const appointmentRef = doc(db, "electricianAppointments", id);
      await updateDoc(appointmentRef, {
        appointmentStatus: status,
      });
      // Update local state to reflect change
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id ? { ...appointment, appointmentStatus: status } : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  // Filtered lists based on the active tab
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.appointmentStatus === "Pending"
  );
  const historyAppointments = appointments.filter(
    (appointment) => appointment.appointmentStatus !== "Pending"
  );

  return (
    <div className="electrician-admin">
      <h2>Electrician Admin Panel</h2>
      <p>Manage electrician service requests and track ongoing tasks.</p>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* Tab Content */}
      <div className="appointments-list">
        {activeTab === "pending" && (
          <div>
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <p><strong>Name:</strong> {appointment.name}</p>
                  <p><strong>Contact:</strong> {appointment.contact}</p>
                  <p><strong>Appointment Date:</strong> {appointment.appointmentDate}</p>
                  <p><strong>Wing:</strong> {appointment.wing}</p>
                  <p><strong>Flat:</strong> {appointment.flat}</p>
                  <p><strong>Status:</strong> {appointment.appointmentStatus}</p>
                  <button
                    className="confirm-btn"
                    onClick={() => handleStatusChange(appointment.id, "Confirmed")}
                  >
                    Confirm
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => handleStatusChange(appointment.id, "Cancelled")}
                  >
                    Cancel
                  </button>
                </div>
              ))
            ) : (
              <p>No pending requests found.</p>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            {historyAppointments.length > 0 ? (
              historyAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <p><strong>Name:</strong> {appointment.name}</p>
                  <p><strong>Contact:</strong> {appointment.contact}</p>
                  <p><strong>Appointment Date:</strong> {appointment.appointmentDate}</p>
                  <p><strong>Wing:</strong> {appointment.wing}</p>
                  <p><strong>Flat:</strong> {appointment.flat}</p>
                  <p><strong>Status:</strong> {appointment.appointmentStatus}</p>
                </div>
              ))
            ) : (
              <p>No history found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectricianAdmin;
