import { useState } from 'react';
import React from 'react';
import './Home.css'
import Header from '../../Header/Header';
import ExploreMenu from '../../ExploreMenu/ExploreMenu';
import FoodDisplay from '../../FoodDisplay/FoodDisplay';
import AppDownload from '../../AppDownload/AppDownload';

const Home = () => {
  const [category, setcategory] = useState("All");
  return (
    <div>
      <Header/>
      <ExploreMenu category={category} setCategory={setcategory}/>
      <FoodDisplay category={category}/>
      <AppDownload/>
    </div>
  );
}

export default Home;
