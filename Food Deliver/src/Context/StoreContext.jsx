import { createContext, useEffect, useState } from "react";
import { food_list as localFoods } from "../assets/assets";

export const StoreContext = createContext(null);

export const url = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setcartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Load foods from the backend and keep the original local images
  useEffect(() => {
    fetch(`${url}/api/food`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load menu");
        return res.json();
      })
      .then((data) => {
        const withImages = data.map((food) => {
          const local = localFoods.find(
            (item) =>
              item.name.trim().toLowerCase() === food.name.trim().toLowerCase()
          );
          return { ...food, image: local ? local.image : food.image };
        });
        setFoodList(withImages);
      })
      .catch((err) => {
        console.error("Could not load food list:", err.message);
      });
  }, []);

  const addToCart = (itemId) => {
    setcartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromcart = (itemId) => {
    setcartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // Save the login so the customer stays logged in after a refresh
  const saveLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  // Create a new account (Sign Up)
  const registerUser = async ({ name, email, password }) => {
    const res = await fetch(`${url}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Could not create account");
    saveLogin(data);
    return data;
  };

  // Log in with an existing account
  const loginUser = async ({ email, password }) => {
    const res = await fetch(`${url}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Could not log in");
    saveLogin(data);
    return data;
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Send the cart and the delivery form to the backend as a new order
  const placeOrder = async (details) => {
    const items = Object.keys(cartItems)
      .filter((id) => cartItems[id] > 0)
      .map((id) => ({ foodId: id, quantity: cartItems[id] }));

    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${url}/api/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...details, items }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Could not place order");

    setcartItems({});
    return data;
  };

  const contextValue = {
    food_list,
    cartItems,
    setcartItems,
    addToCart,
    removeFromcart,
    getTotalCartAmount,
    placeOrder,
    token,
    user,
    registerUser,
    loginUser,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;