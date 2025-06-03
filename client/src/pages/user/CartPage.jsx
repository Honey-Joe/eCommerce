// src/pages/CartPage.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  decreaseQuantity,
  addToCart,
} from "../../features/cart/cartSlice";
import Layout from "../../layouts/Layout";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  console.log(items);

  return (
    <Layout>
      <div className="max-w-[80%] mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border p-4 rounded-md"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p>Price: ₹{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Seller: {item?.seller.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item._id))}
                    className="bg-yellow-500 px-2 text-white rounded"
                  >
                    -
                  </button>
                  <button
                    onClick={() => dispatch(addToCart(item))}
                    className="bg-green-500 px-2 text-white rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="bg-red-500 px-3 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link to={"/user/checkout"}>
            <button>
                Order now
            </button>
        </Link>
      </div>
    </Layout>
  );
};

export default CartPage;
