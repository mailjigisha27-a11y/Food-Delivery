import React, { useContext, useState } from 'react';
import './PlaceOrder.css'
import { StoreContext } from '../../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const { getTotalCartAmount, placeOrder } = useContext(StoreContext)
  const navigate = useNavigate()

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (submitting) return

    if (getTotalCartAmount() === 0) {
      alert("Your cart is empty. Please add some food first.")
      navigate("/")
      return
    }

    try {
      setSubmitting(true)
      const order = await placeOrder({
        customerName: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        address: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      })
      alert(`Order placed successfully! Your order id is ${order._id}`)
      navigate("/")
    } catch (err) {
      alert(`Could not place the order: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className='place-order' onSubmit={onSubmitHandler}>
      <div className='place-order-left'>
       <p className="title">Delivery Information</p>
       <div className="multi-fields">
        <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name'/>
        <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
       </div>
       <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
       <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street'/>
       <div className="multi-fields">
        <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City'/>
        <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State'/>
       </div>
       <div className="multi-fields">
        <input required name='zipCode' onChange={onChangeHandler} value={data.zipCode} type="text" placeholder='Zip code'/>
        <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
       </div>
       <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='phone' />
       </div>
      <div className='place-order-right'>
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount()===0?0:2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>${ getTotalCartAmount()===0?0:getTotalCartAmount() + 2}</b>
          </div>

          <button type='submit'>PROCEED TO PAYMENT</button>

        </div>

      </div>
    </form>
  );
}

export default PlaceOrder;