import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Foodapi.css';
import { useParams } from 'react-router-dom'; 
import "./Showitems.css";
import { Link } from 'react-router-dom';

const Foodapi = () => {
    const [fetchData, setFetchData] = useState([]); // State for fetched data
    const [filteredData, setFilteredData] = useState([]); // State for filtered data

    const { name } = useParams(); 
    console.log("name==",name)
    const fetchRestaurantData = async () => {
        try {
            const res = await axios.get('http://localhost:4000/credentials/fooddata');
            console.log('Fetched data:', res.data);

            setFetchData(res.data); 
            const filteredItems = res.data.filter((item) => item.restaurant_name === name);
            setFilteredData(filteredItems);
            console.log('Filtered data:', filteredItems);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchRestaurantData();
    }, [name]); 

    return (
        <div>
            <div className="showitemsdiv">
                <div className="showitems-container">
                    {filteredData.length > 0 ? (
                        filteredData[0].items.map((item, index) => (
                            <div className="show-card" key={index}>
                                <div className="card-header">
                                    <h2>{item.item_name}</h2>
                                </div>
                                <div className="card-body">
                                    <img
                                        src={item.item_image_url}
                                        alt={item.item_name}
                                        style={{ width: '100%' }}
                                    />
                                    <p><strong>Cook Time:</strong> {item.arrival_time}</p>
                                    <p><strong>Price:</strong> {item.price}</p>
                                    <p><strong>Offer Price:</strong> {item.offer_price}</p>
                                    <p><strong>Rating:</strong> {item.reviews}</p>
                                </div>
                                <br />
                                <div className="card-footer">
                                    <button><Link to={`/order/${item.item_id}`}>Order</Link> </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No items available for the selected restaurant.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Foodapi;
