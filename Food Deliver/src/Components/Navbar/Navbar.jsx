import { useContext, useState } from "react";
import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import {Link, useNavigate} from 'react-router-dom';
import { StoreContext } from "../../Context/StoreContext";

const Navbar = ({setShowLogin}) => {
    
  const [Menu, setMenu] = useState("Menu");

  const {getTotalCartAmount, token, user, logout} = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
        {token && user && user.role === "admin" && (
          <Link to='/admin' style={{ color: "#49557e", fontSize: "17px" }}>
            Admin
          </Link>
        )}
        {token && (
          <Link to='/myorders' style={{ color: "#49557e", fontSize: "17px" }}>
            My Orders
          </Link>
        )}
        {token
          ? <button onClick={handleLogout}>Logout</button>
          : <button onClick={() => setShowLogin(true)}>Sign In</button>}
      </div>
    </div>
  );
};

export default Navbar;