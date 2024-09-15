import './UserDetailsForm.css';
import React, { useState } from 'react';
import { db, storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';


const UserDetailsForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        contact: '',
        profilePicture: null
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        username: '',
        contact: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleProfilePictureChange = (e) => {
        setFormData({
            ...formData,
            profilePicture: e.target.files[0]
        });
    };

    const navigate = useNavigate();

    const validateForm = () => {
        let errors = {};
        if (!formData.name) errors.name = "Name is required.";
        if (!formData.username) errors.username = "Username is required.";
        if (!formData.contact) errors.contact = "Contact number is required.";

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    console.error("No user signed.");
                    return;
                }

                let profile = null;
                if (formData.profilePicture) {
                    const storageRef = ref(storage, `profilePicture/${user.uid}/${formData.profilePicture.name}`);
                    await uploadBytes(storageRef, formData.profilePicture);
                    profile = await getDownloadURL(storageRef);
                }

                await setDoc(doc(db, "Users", user.uid), {
                    name: formData.name,
                    username: formData.name,
                    contact: formData.contact,
                    profileURL: profile
                }, {merge: true});

                console.log("User details updated");
                navigate('/dashboard');
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     if (validateForm()) {
    //         // Perform submission logic, e.g., send data to backend
    //         console.log("Form submitted successfully", formData);
    //     }
    // };

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit} className='user-details-form'>
                <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        className={formErrors.name ? 'input-error' : ''}
                        required
                    />
                    {formErrors.name && <span className='error-text'>{formErrors.name}</span>}
                </div>

                <div className='form-group'>
                    <label htmlFor='username'>Username</label>
                    <input
                        type='text'
                        id='username'
                        name='username'
                        value={formData.username}
                        onChange={handleInputChange}
                        className={formErrors.username ? 'input-error' : ''}
                        required
                    />
                    {formErrors.username && <span className='error-text'>{formErrors.username}</span>}
                </div>

                <div className='form-group'>
                    <label htmlFor='contact'>Contact Number</label>
                    <input
                        type='text'
                        id='contact'
                        name='contact'
                        value={formData.contact}
                        onChange={handleInputChange}
                        className={formErrors.contact ? 'input-error' : ''}
                        required
                    />
                    {formErrors.contact && <span className='error-text'>{formErrors.contact}</span>}
                </div>

                <div className='form-group'>
                    <label htmlFor='profilePicture'>Profile Picture</label>
                    <input
                        type='file'
                        id='profilePicture'
                        name='profilePicture'
                        onChange={handleProfilePictureChange}
                    />
                </div>

                <button type='submit' className='submit-button'>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default UserDetailsForm;
