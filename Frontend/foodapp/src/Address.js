import React, { useState } from 'react';
import axios from 'axios';
import "./Address.css";
import { useNavigate } from 'react-router-dom';
const Address = () => {
  // State to store form values
  const [formData, setFormData] = useState({
    firstName: '',
    mobileNumber: '',
    landmark: '',
    pinCode: '',
    street: ''
  });


  const Navigate= useNavigate();
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    console.log("formdata==",formData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to save the address
      console.log("formdata==",formData);
      const res = await axios.post('http://localhost:4000/address', formData);
      console.log("Address saved:", res.data);
      alert("Address saved successfully ");
      Navigate('/viewaddress')
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <div className='address-container'>
      
      <form className="address-form" onSubmit={handleSubmit}>
      <h1>Enter Address</h1>
        <label>
          <p>First Name:</p>
          <input
            type="text"
            name="firstName"
            placeholder="Enter First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <p>Mobile Number:</p>
          <input
            type="text"
            name="mobileNumber"
            placeholder="Enter Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <p>Landmark:</p>
          <input
            type="text"
            name="landmark"
            placeholder="Enter Landmark"
            value={formData.landmark}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <p>Pin code:</p>
          <input
            type="text"
            name="pinCode"
            placeholder="Enter Pin code"
            value={formData.pinCode}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <p>Street:</p>
          <input
            type="text"
            name="street"
            placeholder="Enter Street"
            value={formData.street}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Save Address</button>
      </form>
    </div>
  );
};

export default Address;
