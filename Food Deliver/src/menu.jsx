import { useContext } from "react";
import { StoreContext, url } from "./Context/StoreContext";

function Menu() {
  const {
    food_list,
    loading,
    error,
    cartItems,
    addToCart,
    removeFromcart,
    getTotalCartAmount,
    getCartCount,
  } = useContext(StoreContext);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>Error: {error}</p>;

  const buttonStyle = {
    padding: "4px 12px",
    fontSize: "16px",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Menu</h2>
      {food_list.length === 0 && <p>No food items yet.</p>}

      {food_list.map((food) => (
        <div
          key={food._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          {food.image && (
            <img
              src={food.image.startsWith("http") ? food.image : `${url}/${food.image}`}
              alt={food.name}
              style={{ width: "120px", borderRadius: "8px" }}
            />
          )}
          <h3>{food.name}</h3>
          <p>{food.description}</p>
          <p>
            <strong>₹{food.price}</strong> · {food.category}
          </p>

          {!cartItems[food._id] ? (
            <button style={buttonStyle} onClick={() => addToCart(food._id)}>
              Add to cart
            </button>
          ) : (
            <div>
              <button style={buttonStyle} onClick={() => removeFromcart(food._id)}>
                −
              </button>
              <span style={{ margin: "0 12px" }}>{cartItems[food._id]}</span>
              <button style={buttonStyle} onClick={() => addToCart(food._id)}>
                +
              </button>
            </div>
          )}
        </div>
      ))}

      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          borderTop: "2px solid #ddd",
          padding: "12px",
          fontWeight: "bold",
        }}
      >
        Cart: {getCartCount()} items · Total: ₹{getTotalCartAmount()}
      </div>
    </div>
  );
}

export default Menu;