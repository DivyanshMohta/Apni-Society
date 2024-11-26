import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import './Maintenance.css';

function AdminMaintenance() {
  const [users, setUsers] = useState([]);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userMaintenances, setUserMaintenances] = useState([]);
  const [fetchingPayments, setFetchingPayments] = useState(false);
  const [paymentStatusField, setPaymentStatusField] = useState('Unpaid'); // New field for Paid/Unpaid
  const [unpaidRecords, setUnpaidRecords] = useState([]);  // Store unpaid records

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, 'Users');
        const userDocs = await getDocs(usersCollection);
        const userData = userDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateMaintenance = async () => {
    if (!amount || !reason || !selectedUserId) {
      setPaymentStatus('Please enter all fields and select a user.');
      return;
    }

    try {
      const maintenanceRef = doc(collection(db, 'Users', selectedUserId, 'maintenance'));
      await setDoc(maintenanceRef, {
        maintenanceAmount: amount,
        maintenanceReason: reason,
        maintenanceDate: Timestamp.fromDate(new Date()),
        paymentStatus: paymentStatusField,  // Save the payment status
      });

      setPaymentStatus(`Maintenance updated for user: ${selectedUserId}`);
      setAmount('');
      setReason('');
      setPaymentStatusField('Unpaid');  // Reset to 'Unpaid' after update
    } catch (error) {
      setPaymentStatus('Error updating maintenance status. Please try again.');
    }
  };

  const handleAddMaintenanceToAll = async () => {
    if (!amount || !reason) {
      setPaymentStatus('Please enter all fields before adding maintenance to all users.');
      return;
    }

    setPaymentStatus('Adding maintenance to all users...');
    try {
      for (const user of users) {
        const maintenanceRef = doc(collection(db, 'Users', user.id, 'maintenance'));
        await setDoc(maintenanceRef, {
          maintenanceAmount: amount,
          maintenanceReason: reason,
          maintenanceDate: Timestamp.fromDate(new Date()),
          paymentStatus: paymentStatusField,  // Save the payment status for all users
        });
      }

      setPaymentStatus('Maintenance successfully added to all users.');
      setAmount('');
      setReason('');
      setPaymentStatusField('Unpaid');  // Reset after adding
    } catch (error) {
      setPaymentStatus('Error adding maintenance to all users. Please try again.');
    }
  };

  const handleFetchUserPaymentStatus = async () => {
    if (!selectedUserId) {
      setPaymentStatus('Please select a user to fetch payment status.');
      return;
    }

    setFetchingPayments(true);
    try {
      const maintenanceCollection = collection(db, 'Users', selectedUserId, 'maintenance');
      const maintenanceDocs = await getDocs(maintenanceCollection);
      const maintenanceData = maintenanceDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserMaintenances(maintenanceData);
      setPaymentStatus(`Fetched payment status for user: ${selectedUserId}`);
    } catch (error) {
      setPaymentStatus('Error fetching payment status. Please try again.');
    } finally {
      setFetchingPayments(false);
    }
  };

  const fetchUnpaidPayments = async () => {
    if (!selectedUserId) {
      setPaymentStatus('Please select a user to fetch unpaid payments.');
      return;
    }

    setFetchingPayments(true);
    try {
      const maintenanceCollection = collection(db, 'Users', selectedUserId, 'maintenance');
      const maintenanceDocs = await getDocs(maintenanceCollection);
      const unpaid = maintenanceDocs.docs.filter(doc => doc.data().paymentStatus === 'Unpaid');

      setUnpaidRecords(unpaid);
      setPaymentStatus(`Fetched unpaid payments for user: ${selectedUserId}`);
    } catch (error) {
      setPaymentStatus('Error fetching unpaid payments. Please try again.');
    } finally {
      setFetchingPayments(false);
    }
  };

  const markAsPaid = async (maintenanceId) => {
    try {
      const maintenanceRef = doc(db, 'Users', selectedUserId, 'maintenance', maintenanceId);
      await updateDoc(maintenanceRef, {
        paymentStatus: 'Paid',
      });

      setPaymentStatus('Payment marked as Paid');
      setUnpaidRecords(unpaidRecords.filter(record => record.id !== maintenanceId)); // Remove from unpaid list
    } catch (error) {
      setPaymentStatus('Error marking payment as Paid. Please try again.');
    }
  };

  return (
    <div className="admin-maintenance">
      <h1>Admin - Manage Maintenance</h1>
      <select onChange={(e) => setSelectedUserId(e.target.value)} value={selectedUserId}>
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name} - {user.email}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <div>
        <label>Payment Status: </label>
        <select onChange={(e) => setPaymentStatusField(e.target.value)} value={paymentStatusField}>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>
      </div>
      <button onClick={handleUpdateMaintenance}>Update Maintenance</button>
      <button onClick={handleAddMaintenanceToAll}>Add Maintenance to All</button>
      <button onClick={handleFetchUserPaymentStatus}>
        {fetchingPayments ? 'Fetching...' : 'Fetch Payment Status'}
      </button>
      <button onClick={fetchUnpaidPayments}>
        {fetchingPayments ? 'Fetching Unpaid Payments...' : 'Fetch Unpaid Payments'}
      </button>
      <div>{paymentStatus}</div>
      {unpaidRecords.length > 0 && (
        <div className="unpaid-records">
          <h3>Unpaid Payments</h3>
          <ul>
            {unpaidRecords.map(record => (
              <li key={record.id}>
                {record.data().maintenanceDate.toDate().toLocaleDateString()} - ₹{record.data().maintenanceAmount} - {record.data().maintenanceReason}
                <button onClick={() => markAsPaid(record.id)}>Mark as Paid</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {userMaintenances.length > 0 && (
        <div className="maintenance-status">
          <h3>Maintenance Records for {selectedUserId}</h3>
          <ul>
            {userMaintenances.map(record => (
              <li key={record.id}>
                {record.maintenanceDate.toDate().toLocaleDateString()}: ₹{record.maintenanceAmount} - {record.maintenanceReason} - <strong>{record.paymentStatus}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminMaintenance;
