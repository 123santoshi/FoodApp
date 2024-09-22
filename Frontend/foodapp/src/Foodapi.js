import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Foodapi.css";
import { Link } from 'react-router-dom';


const Foodapi = () => {
    const [data, setData] = useState([]);
    const [allitems,setAllItems] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:4000/credentials/fooddata");
            console.log(res.data);
            const combinedItems = res.data.flatMap(restaurant => restaurant.items);
            setAllItems(combinedItems);
            console.log("allitens==",allitems);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="main-fooddiv">
            <div className="card-container">
                {allitems.map((item, index) => (
                    <div className="card" key={index}>
                        <div className="card-header">
                            <h2>{item.item_name}</h2>
                        </div>
                        <div className="card-body">
                            <img src={item.item_image_url} alt={item.item_name} style={{ width: "100%" }} />
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
                ))}
            </div>
        </div>
    
    );
};

export default Foodapi ;
