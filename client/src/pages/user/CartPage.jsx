// src/pages/CartPage.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  addToCart,
  fetchCart,
  clearCart,
  updateQuantity,
} from "../../features/cart/cartSlice";
import Layout from "../../layouts/Layout";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { items } = useSelector((state) => state.cart);
  console.log(items);
  const cartId = items[0]?._id;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCart());
  }, []);

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
                className="flex flex-wrap justify-between items-center border p-4 rounded-md"
              >
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p>Price: ₹{item.product.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Seller : {item.sellerName}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch(addToCart(item.product._id))}
                    className="bg-green-500 px-2 text-white rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(updateQuantity(item.product._id))}
                    className="bg-orange-500 px-2 text-white rounded"
                  >
                    -
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(item.product._id))}
                    className="bg-red-500 px-3 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-3 items-center py-3 ">
          
        <button
                onClick={() => dispatch(clearCart(cartId))}
                className="bg-blue-500 px-5 py-2  text-white rounded"
              >
                Clear Cart
              </button>

        <Link to={"/user/checkout"}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded ">
            Order now
          </button>
        </Link>

        </div>

      </div>
    </Layout>
  );
};

export default CartPage;
