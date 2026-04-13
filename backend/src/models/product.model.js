import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true
        },

        image: {
            type: [String],
            required: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },
        
        subCategory: {
            type: String,
            required: true,
            trim: true
        },

        sizes:{
            type: [String],
            required: true
        }, 

        bestSeller: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema);