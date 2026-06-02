import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: [String],
      required: true,
      validate: [(arr) => arr.length > 0, "At least one image is required"],
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subCategory: {
      type: String,
      required: true,
      trim: true,
    },

    sizes: {
      type: [String],
      required: true,
      validate: [(arr) => arr.length > 0, "At least one size is required"],
    },

    colors: {
      type: [String],
      default: [],
    },

    variants: [
      {
        size: String,
        color: String,
        stock: { type: Number, default: 0, min: 0 },
      },
    ],

    bestSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model("Product", productSchema);
