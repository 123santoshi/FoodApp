import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./Orders.css";

const Order = () => {
    const [foodbyId, setFoodId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [order, setOrder] = useState(false);
    const { id } = useParams();
    const [address, setAddress] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const navigate = useNavigate();

    const getAddress = async () => {
        try {
            const res = await axios.get("http://localhost:4000/address");
            setAddress(res.data);
        } catch (error) {
            console.error("Error fetching address data:", error);
        }
    };

    const getDatabyID = async (id) => {
        try {
            const res = await axios.get(`http://localhost:4000/credentials/fooddata/${id}`);
            setFoodId(res.data[0]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const removeSymbol = (val) => {
        return Number(val.replace(/[^\d]/g, ''));
    };

    const finalPrice = () => {
        if (foodbyId) {
            const priceAfterOffer = removeSymbol(foodbyId.price) - removeSymbol(foodbyId.offer_price);
            const totalPrice = priceAfterOffer + 0.12 * removeSymbol(foodbyId.price);
            return totalPrice * quantity;
        }
        return 0;
    };

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value));
        setQuantity(value);
    };

    const handleAddressChange = (e) => {
        setSelectedAddress(e.target.value);
    };

    const orderPlaced = async (e) => {
        e.preventDefault();
        setOrder(true);

        const foodItem = {
            ...foodbyId,
            quantity,
            totalPrice: finalPrice(),
            address: selectedAddress,
        };

        const email = localStorage.getItem("userEmail");
        if (!email) {
            console.error("No email found in localStorage");
            return;
        }

        try {
            const res = await axios.post("http://localhost:4000/credentials/orderslist", { email, orders: foodItem });
            console.log("Order placed successfully:", res.data);
        } catch (error) {
            console.error("Error placing order:", error);
        }

        navigate("/vieworders");
    };

    useEffect(() => {
        getDatabyID(id);
        getAddress();
    }, [id]);

    if (!foodbyId) {
        return <div>Loading...</div>;
    }

    return (
        <div className='order-container'>
            {!order ? (
                <>
                    <h1 style={{color:'green' , fontSize:'30px', textAlign:'LEFT'}}>Order Details</h1>
                    <form className='order-form' onSubmit={orderPlaced}>
                    <label htmlFor="quantity">Select quantity:</label>
                        <input 
                            type="number" 
                            id="quantity" 
                            placeholder="Select quantity" 
                            min="1" 
                            value={quantity} 
                            onChange={handleQuantityChange} 
                        />


                        <label htmlFor="address">Select address:</label>
                        <select id="address" onChange={handleAddressChange} value={selectedAddress} required>
                            <option value="">Select Address</option>
                            {address.map((item, index) => 
                                item.location.map((inneritem, innerIndex) => {
                                    const { firstName, landmark, mobileNumber, pinCode, street } = inneritem;
                                    const fullAddress = `${firstName}, ${landmark}, ${mobileNumber}, ${pinCode}, ${street}`; 
                                    
                                    return (
                                        <option key={`${index}-${innerIndex}`} value={fullAddress}>
                                            {fullAddress}
                                        </option>
                                    );
                                })
                            )}
                        </select>

                        <p><span>Ordered Item :</span> {foodbyId.item_name}</p>
                        <p><span>Actual Price : </span>{foodbyId.price}</p>
                        <p><span>Offer Price : </span>{foodbyId.offer_price}</p>
                        <p><span>Gst (12%) : </span> ₹{0.12 * removeSymbol(foodbyId.price)}</p>

                        <p><span>Total Price : ₹</span>{finalPrice()}</p>

                       
                        <button type="submit">Place Order</button>
                    </form>
                </>
            ) : (
                <>
                    <h1>Order Placed</h1>
                    <p>Your order will arrive in {foodbyId.arrival_time}</p>
                </>
            )}
        </div>
    );
};

export default Order;
