
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerEmail :{
      type: String
    },
    buyerName : {
      type:String
    },
    otp:String,
    otpExpiresAt : Date,

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
            
        },
        sellerEmail : {
          type:String
        },
      },
    ],

    shippingInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);
