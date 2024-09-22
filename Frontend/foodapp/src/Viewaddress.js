import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Viewaddress.css";

const ViewAddress = () => {
  const [addressData, setAddressData] = useState([]);

  const getAddress = async () => {
    try {
      const response = await axios.get("http://localhost:4000/address");
      console.log("res==", response.data);
      const address = response.data.map(item => item.location);
      setAddressData(address);
    } catch (error) {
      console.error("Error while fetching the addresses:", error);
      throw error; // Rethrow the error for further handling if needed
    }
  };

  useEffect(() => {
    getAddress(); // Call the function when the component mounts
  }, []);

  return (
    <div className="view-address-container">
      <h1 style={{color:'red', fontSize:'30px'}}>View Address</h1>
      {addressData.length > 0 ? (
        <div className="card-container">
          {addressData.map((address, index) => (
            <div className="address-card" key={index}>
              <h2 style={{color:'blue'}}>Address {index+1}</h2>
              <p><strong>Name:</strong> {address[0].firstName}</p>
              <p><strong>Landmark:</strong> {address[0].landmark}</p>
              <p><strong>Mobile:</strong> {address[0].mobileNumber}</p>
              <p><strong>Pin Code:</strong> {address[0].pinCode}</p>
              <p><strong>Street:</strong> {address[0].street}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No addresses found.</p>
      )}
    </div>
  );
};

export default ViewAddress;
