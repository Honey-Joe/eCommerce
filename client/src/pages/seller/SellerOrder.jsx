import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyOrdersRequest,
  getMyOrdersSuccess,
  getMyOrdersFail,
} from "../../features/orders/orderSlice";
import axiosInstance from "../../axios";
import {toast} from "react-toastify";

const SellerOrder = () => {
  const dispatch = useDispatch();
  const [otpSentToOrder, setOtpSentToOrder] = useState(null);
  const [otpInputs, setOtpInputs] = useState({}); // Store OTPs per order
  const { myOrders, myOrdersLoading, myOrdersError } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch(getMyOrdersRequest());
      try {
        const { data } = await axiosInstance.get("/orders/seller");
        dispatch(getMyOrdersSuccess(data));
      } catch (error) {
        dispatch(
          getMyOrdersFail(
            error.response?.data?.message ||
              error.message ||
              "Failed to fetch orders"
          )
        );
      }
    };

    fetchOrders();
  }, [dispatch]);

  const sendOtp = async (orderId) => {
    try {
      const res = await axiosInstance.put(`/orders/${orderId}/send-otp`);
      toast.success("OTP sent to buyer's email.");
      setOtpSentToOrder(orderId);
    } catch (err) {
      console.error("Send OTP Error:", err.message);
      toast.error("Failed to send OTP.");
    }
  };

  const verifyOtp = async (orderId) => {
    try {
      const otp = otpInputs[orderId];
      if (!otp) return alert("Enter OTP before submitting.");

      const res = await axiosInstance.put(`/orders/${orderId}/verify-otp`, {
        otp,
      });
      toast.success(res.data.message || "Order marked as delivered");
      setOtpSentToOrder(null);
      setOtpInputs((prev) => ({ ...prev, [orderId]: "" }));
      // Refetch orders
      const { data } = await axiosInstance.get("/orders/seller");
      dispatch(getMyOrdersSuccess(data));
    } catch (err) {
      console.error("Verify OTP Error:", err.message);
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleOtpChange = (orderId, value) => {
    setOtpInputs((prev) => ({ ...prev, [orderId]: value }));
  };

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
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Buyer Email Id:</strong> {order.buyerEmail}
              </p>
              <p>
                <strong>Status:</strong> {order.paymentStatus}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalPrice}
              </p>
              <p>
                <strong>Items:</strong>
              </p>
              <ul className="ml-4 list-disc">
                {order.orderItems.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Delivery Status:</strong>{" "}
                {order.isDelivered ? (
                  <span className="text-green-600 font-semibold">Delivered</span>
                ) : otpSentToOrder === order._id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otpInputs[order._id] || ""}
                      onChange={(e) =>
                        handleOtpChange(order._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded"
                      onClick={() => verifyOtp(order._id)}
                    >
                      Submit OTP
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-red-600 text-white px-5 py-2 mt-2 rounded"
                    onClick={() => sendOtp(order._id)}
                  >
                    Send OTP
                  </button>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrder;
