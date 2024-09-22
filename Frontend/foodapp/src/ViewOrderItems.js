import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./ViewOrderItems.css";

const ViewOrderItems = () => {
    const [showOrders, setShowOrders] = useState([]);

    // Function to get the orders from the API
    const getOrders = async () => {
        try {
            const email = localStorage.getItem("userEmail");
            console.log("Logged email in ViewOrderItems:", email);
            const response = await axios.get(`http://localhost:4000/credentials/orderslist/${email}`);
            console.log("Response of orders list:", response.data);
            
            // Check if orders exist in the response
            if (response.data && response.data.orders) {
                setShowOrders(response.data.orders); // Set orders from the response
                console.log("Orders fetched:", response.data.orders);
            } else {
                console.log("No orders found in the response.");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        getOrders(); 
    }, []);

    return (
        <div className="order-list">
            <h2 style={{color:'red' , fontSize:'30px' ,fontWeight:'bold'}}>Ordered Items</h2>
            <div className="order-cards">
                {Array.isArray(showOrders) && showOrders.length > 0 ? (
                    showOrders.filter(order => order !== null).map((order, index) => (
                        <div className="order-card" key={index}>
                            <img 
                                src={order.item_image_url} 
                                alt={order.item_name} 
                                className="order-image" 
                                style={{ borderRadius: '50%' , width: '200px' , height:'200px' }} 
                            />
                            <h3>{order.item_name}</h3>
                            <p><span>Price : </span> {order.price}</p>
                            <p><span>Arrival Time :</span> {order.arrival_time}</p>
                            <p><span>Reviews : </span> {order.reviews}</p>
                            <p><span>Offer Price : </span>{order.offer_price}</p>
                            <p><span>Quantity : </span>{order.quantity}</p>
                            <p><span>Total Price : ₹</span>{order.totalPrice}</p>
                            <p><span>Address : </span> {order.address || "No address provided"}</p>
                        </div>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
};

export default ViewOrderItems;
