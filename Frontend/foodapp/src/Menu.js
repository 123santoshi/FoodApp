import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css'; // Assuming you have a CSS file for the menu component

const Menu = () => {
  const [showItems, setShowItems] = useState(false);
  const email = localStorage.getItem('userEmail'); // Get user email from localStorage

  const changeHandler = () => {
    setShowItems(!showItems); // Toggle dropdown visibility
  };

  return (
    <div className="menu-container">
      <div className="homeprofile-container">
        <h2 className="user-email" onClick={changeHandler}>
          {email}
        </h2>
        {showItems && (
          <div className="dropdown-menu">
            <ul className="menu-list">
              <li className="menu-item">
                <Link to="/foodapi" className="menu-link">View All Items</Link>
              </li>
              <li className="menu-item">
                <Link to="/vieworders" className="menu-link">View Orders</Link>
              </li>
              <li className="menu-item">
                <Link to="/addaddress" className="menu-link">Add Address</Link>
              </li>
              <li className="menu-item">
                <Link to="/viewaddress" className="menu-link">View Addresses</Link>
              </li>
              <li className="menu-item">
                <Link to="/signin" className="menu-link">Signout</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
