import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Toprated.css';
import { Link } from 'react-router-dom';

const Toprated = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [hoveredRestaurant, setHoveredRestaurant] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:4000/credentials/fooddata');
            console.log(res.data);

            const restaurantData = res.data.map((item) => {
                let totalRating = 0;
                let count = 0;

                const firstImg = item.items[0]?.item_image_url || '';

                item.items.forEach((innerItem) => {
                    const rating = parseFloat(innerItem.reviews.split('/')[0]);
                    totalRating += rating;
                    count++;
                });

                const avg = count > 0 ? Math.round((totalRating / count) * 10) / 10 : 0;

                return {
                    name: item.restaurant_name,
                    avgRating: avg,
                    firstImg: firstImg,
                    items: item.items 
                };
            });

            // Sort restaurants by average rating in descending order and take the top 5
            const topRestaurants = restaurantData
                .sort((a, b) => b.avgRating - a.avgRating).slice(0,5);
            setRestaurants(topRestaurants);
            console.log('Top restaurants:', topRestaurants);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


 
    return (
        
            <div>
                <h1 style={{color:'red', fontSize:'35px'}}>Top 5  Restaurants</h1>
                <div className='top-card'>
                    <div className='card-header'>
                        <div className='cards'>
                            {restaurants.map((restaurant, index) => (
                                <div
                                    key={index}
                                    className='restaurant-card'
                                >
                                    <Link to={`/showItems/${encodeURIComponent(restaurant.name)}`}>
                                        <img src={restaurant.firstImg} alt={restaurant.name} className='top-rated-img' />
                                        <h2>{restaurant.name}</h2>
                                        <h2>{restaurant.avgRating || 'N/A'}</h2>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );

};

export default Toprated;
