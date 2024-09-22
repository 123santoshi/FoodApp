import React, { useState, useEffect } from 'react';
import "./Imageslider.css";
import offer1 from './images/offer.jpg'; // Adjust file name accordingly
import offer2 from './images/offer2.png';
import offer3 from './images/offer3.jpg';


const MyCollection = [
    {
        imgPath: offer1,
    },
    {
        imgPath:offer2,
    },
    {
        imgPath: offer3,
    },
];

const Imageslider = () => {
    const [curIndex, setCurIndex] = useState(0);
    const imgLength = MyCollection.length;

    const prevSlide = () => {
        setCurIndex((prev) => (prev - 1 + imgLength) % imgLength);
    };

    const nextSlide = () => {
        setCurIndex((prev) => (prev + 1) % imgLength);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 1000); 
        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);
    return (
        <div className='main-slider' style={{background:'transparent'}}>
            <h1 style={{color:'red', fontSize:'35px'}}>See the offers and grab them</h1>
            <div className='slider-div'>
                <div>
                    <img src={MyCollection[curIndex].imgPath} alt={MyCollection[curIndex].label} className='slider-img'   />
                </div>
                
            </div>
        </div>
    );
};

export default Imageslider;
