import { useContext, useState } from "react";
import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import {Link} from 'react-router-dom';
import { StoreContext } from "../../Context/StoreContext";

const Navbar = ({setShowLogin}) => {
    
  const [Menu, setMenu] = useState("Menu");

  const {getTotalCartAmount} = useContext(StoreContext);

  return (
    <div className="Navbar">
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={()=>setMenu("Home")} className={Menu==="Home"?"active":""}>Home</Link>
        <a href="#explore-menu" onClick={()=>setMenu("Menu")} className={Menu==="Menu"?"active":""}>Menu</a>
        <a href="#app-download" onClick={()=>setMenu("Mobile-app")} className={Menu==="Mobile-app"?"active":""}>Mobile-app</a>
        <a  href="#footer"onClick={()=>setMenu("Contact us")} className={Menu==="Contact us"?"active":""}>Contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
           <Link to ='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() ===0 ?"":"dot"}></div>
        </div>
      <button onClick={() => setShowLogin(true)}>Sign In</button>
      </div>
    </div>
  );
};

export default Navbar;
