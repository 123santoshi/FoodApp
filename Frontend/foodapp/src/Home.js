import React, { useState } from 'react';
import Toprated from './Toprated';
import Imageslider from './Imageslider';
import ViewOrderItems from './ViewOrderItems';
import Allrestaurants from './Allrestaurants';
import Menu from './Menu';

const Home = () => {


  return (
    <div>
      <Menu></Menu>
      <br/><br/>
      <Toprated />
      <Imageslider />
      <Allrestaurants />
      <ViewOrderItems />
    </div>
  );
};

export default Home;
