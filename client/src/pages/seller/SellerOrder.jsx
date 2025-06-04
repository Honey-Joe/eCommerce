import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Layout from "../../layouts/Layout";
import {
  getMyOrdersRequest,
  getMyOrdersSuccess,
  getMyOrdersFail,
} from "../../features/orders/orderSlice";
import axiosInstance from "../../axios";

const SellerOrder = () => {
  const dispatch = useDispatch();
  const { myOrders, myOrdersLoading, myOrdersError } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(getMyOrdersRequest());
      try {
        const { data } = await axiosInstance.get("/orders/seller");
        console.log(data);
        dispatch(getMyOrdersSuccess(data));
        console.log("Fetched orders:", data);
      } catch (error) {
        dispatch(
          getMyOrdersFail(
            error.response?.data?.message || error.message || "Failed to fetch orders"
          )
        );
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [dispatch]);

  return (

      <div className="max-w-[100%] mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>

        {myOrdersLoading ? (
          <p>Loading...</p>
        ) : myOrdersError ? (
          <p className="text-red-500">{myOrdersError}</p>
        ) : myOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => (
              <div key={order._id} className="border p-4 rounded shadow-sm">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Buyer Email Id:</strong> {order.buyerEmail}</p>
                <p><strong>Status:</strong> {order.paymentStatus}</p>
                <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                <p><strong>Items:</strong></p>
                <ul className="ml-4 list-disc">
                  {order.orderItems.map((item, idx) => (
                    <li key={idx}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
                <p>Delivery Status : {order.isDelivered ? ("Delivered") : ("Pending")}</p>
                <p></p>
              </div>
            ))}
          </div>
        )}
      </div>
  );
};

export default SellerOrder;
