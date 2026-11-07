import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

const LoginPopup = ({ setShowLogin }) => {
  const { registerUser, loginUser } = useContext(StoreContext);

  const [currState, setcurrState] = useState("Login");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const switchTo = (state) => {
    setcurrState(state);
    setError("");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      if (currState === "Sign Up") {
        await registerUser(data);
      } else {
        await loginUser({ email: data.email, password: data.password });
      }

      setShowLogin(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onSubmitHandler}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="password"
            minLength={currState === "Sign Up" ? 8 : undefined}
            required
          />
        </div>

        {error && (
          <p style={{ color: "tomato", fontSize: "14px" }}>{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : currState === "Sign Up"
            ? "Create account"
            : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing,i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => switchTo("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => switchTo("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;