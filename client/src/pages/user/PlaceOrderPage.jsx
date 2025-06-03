import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import axios from "axios";
import { clearCart } from "../../features/cart/cartSlice";
import axiosInstance from "../../axios";
import { placeOrderFail, placeOrderRequest, placeOrderSuccess } from "../orders/orderSlice";

const PlaceOrderPage = () => {
  const { items } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user); // adjust if user is stored elsewhere
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(items);

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
  dispatch(placeOrderRequest());
  try {
    const orderItems = items.map((item) => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      seller: item.seller._id,
    }));



    const { data } = await axiosInstance.post(
      "/orders",
      {
        orderItems,
        shippingInfo,
        paymentMethod,
        totalPrice,
      },
    );

    dispatch(placeOrderSuccess(data));
    dispatch(clearCart());
  } catch (error) {
    dispatch(
      placeOrderFail(
        error.response?.data?.message || error.message || "Order failed"
      )
    );
  }
};


  return (
    <Layout>
      <div className="max-w-[80%] mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Shipping Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {["address", "city", "state", "postalCode", "country", "phone"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={shippingInfo[field]}
              onChange={handleChange}
              className="border rounded p-2"
              required
            />
          ))}
        </div>

        <div className="mb-4">
          <label className="mr-4 font-medium">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg">Order Summary</h3>
          <p>Total Items: {items.length}</p>
          <p>Name : {items.name}</p>
          <p>Total Price: ₹{totalPrice}</p>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Place Order
        </button>
      </div>
    </Layout>
  );
};

export default PlaceOrderPage;
