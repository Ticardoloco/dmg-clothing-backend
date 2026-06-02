import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },

  size: {
    type: String,
    required: true,
  },

  color: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

     paymentMethod: {
      type: String,
      enum: ["cod", "card", "bank_transfer"],
      default: "cod",
    },

    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipcode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model("Order", orderSchema);
