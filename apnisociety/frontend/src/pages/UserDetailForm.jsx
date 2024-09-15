import React, { useState } from 'react';
import './UserDetailsForm.css';


const UserDetailsForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        contact: '',
        profilePicture: null,
        personName: ''
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

    const validateForm = () => {
        let errors = {};
        if (!formData.name) errors.name = "Name is required.";
        if (!formData.username) errors.username = "Username is required.";
        if (!formData.contact) errors.contact = "Contact number is required.";

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Perform submission logic, e.g., send data to backend
            console.log("Form submitted successfully", formData);
        }
    };

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

                <div className='form-group'>
                    <label htmlFor='personName'>Person's Name</label>
                    <input
                        type='text'
                        id='personName'
                        name='personName'
                        value={formData.personName}
                        onChange={handleInputChange}
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
