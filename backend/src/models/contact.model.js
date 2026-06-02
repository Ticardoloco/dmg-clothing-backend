import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            minLength: 1,
            maxLength: 30
        },
        
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            minLength: 1,
            maxLength: 500
        }
    },

    {
        timestamps: true
    }
);

export const Contact = mongoose.model("Contact", contactSchema);