// import mongoose, { Schema } from "mongoose";

// const mailingListSchema = new Schema(
//     {
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             trim: true,
//             lowercase: true,
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// export const MailingList = mongoose.model("MailingList", mailingListSchema);

import mongoose, { Schema } from "mongoose";

const mailingListSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        status: {
            type: String,
            enum: ["active", "unsubscribed"],
            default: "active",
            lowercase: true,
            trim: true,
        },
        source: {
            type: String,
            default: "Footer Form",
            trim: true,
        }
    },
    {
        timestamps: true
    }
);

// Gracefully handles compiling models in Next.js development server hot-reloads
export const MailingList = mongoose.models.MailingList || mongoose.model("MailingList", mailingListSchema);