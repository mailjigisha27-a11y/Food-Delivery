import React from 'react';
import { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import {Route, Routes } from 'react-router-dom';
import PlaceOrder from './Components/Pages/PlaceOrder/PlaceOrder';
import Cart from './Components/Pages/Cart/Cart';
import Home from './Components/Pages/Home/Home';
import MyOrders from './Components/Pages/MyOrders/MyOrders';
import Admin from './Components/Pages/Admin/Admin';
import Footer from './Components/Footer/Footer';
import LoginPopup from './Components/LoginPopup/LoginPopup';
const App = () => {
  
 const [showLogin, setShowLogin] = useState(false)
  
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
       <Route path='/' element={<Home/>}/>
       <Route path='/cart' element={<Cart/>}/>
       <Route path='/order' element={<PlaceOrder/>}/>
       <Route path='/myorders' element={<MyOrders/>}/>
       <Route path='/admin' element={<Admin/>}/>
      </Routes>
    </div>
    <Footer/>
    </>
  );
}

export default App;