import React, {useState} from 'react';
import {db, storage} from './firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './VendorStyle.css'; // Import the CSS file
import namelogo from '../Images/Only_name_logo.png';

const VendorRegistrationForm = () => {

    const [vendorFormData, setVendorFormData] = useState({
        vendorName: '',
        shopName: '',
        shopAddress: '',
        registrationNumber: '',
        email: '',
        phone: '',
        serviceType: 'medical',
        notes: '',
    })

    const [files, setFiles] = useState({
        aadharCard: null,
        panCard: null,
        shopDetails: null,
      });
    
      const [uploadProgress, setUploadProgress] = useState(0);
    
      // Handle input change
      const handleChange = (e) => {
        setVendorFormData({
          ...vendorFormData,
          [e.target.name]: e.target.value,
        });
      };
    
      // Handle file change
      const handleFileChange = (e) => {
        setFiles({
          ...files,
          [e.target.name]: e.target.files[0],
        });
      };
    
      // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Upload files to Firebase Storage
        const uploadFile = async (file, folder) => {
          if (!file) return null;
          const storageRef = ref(storage, `${folder}/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
    
          return new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
              },
              (error) => reject(error),
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
              }
            );
          });
        };
    
        try {
          // Upload files and get download URLs
          const aadharCardUrl = await uploadFile(files.aadharCard, 'aadharCards');
          const panCardUrl = await uploadFile(files.panCard, 'panCards');
          const shopDetailsUrl = await uploadFile(files.shopDetails, 'shopDetails');
    
          // Save form data to Firestore
          await addDoc(collection(db, 'vendors'), {
            ...vendorFormData,
            aadharCardUrl,
            panCardUrl,
            shopDetailsUrl,
          });
    
          alert('Vendor registered successfully!');
        } catch (error) {
          console.error('Error registering vendor:', error);
          alert('Error registering vendor, please try again.');
        }
      };

  return (
    <div className="container">
      {/* Logo Section */}
      <div className="logo">
        <img src={namelogo} alt="Aapni Society Logo" />
      </div>

      <h1>Aapni Society</h1>
      <h2>Vendor Registration Form</h2>

      <form action="#" method="POST">
        <div className="form-group">
          <label htmlFor="vendorName">Vendor Name</label>
          <input type="text" id="vendorName" name="vendorName" required />
        </div>

        <div className="form-group">
          <label htmlFor="shopName">Shop Name</label>
          <input type="text" id="shopName" name="shopName" required />
        </div>

        <div className="form-group">
          <label htmlFor="shopAddress">Shop Address</label>
          <input type="text" id="shopAddress" name="shopAddress" required />
        </div>

        <div className="form-group">
          <label htmlFor="registrationNumber">Shop Registration Number</label>
          <input type="text" id="registrationNumber" name="registrationNumber" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" required />
        </div>

        <div className="form-group">
          <label htmlFor="serviceType">Type of Service</label>
          <select id="serviceType" name="serviceType" required>
            <option value="medical">Medical</option>
            <option value="grocery">Grocery</option>
            <option value="carwash">Car Wash Services</option>
            <option value="garage">Garage</option>
            <option value="laundry">Laundry</option>
            <option value="dairy">Dairy</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="aadharCard">Upload Aadhar Card</label>
          <input type="file" id="aadharCard" name="aadharCard" multiple />
        </div>

        <div className="form-group">
          <label htmlFor="panCard">Upload PAN Card</label>
          <input type="file" id="panCard" name="panCard" />
        </div>

        <div className="form-group">
          <label htmlFor="shopDetails">Upload Shop Details</label>
          <input type="file" id="shopDetails" name="shopDetails" />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea id="notes" name="notes"></textarea>
        </div>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default VendorRegistrationForm;
