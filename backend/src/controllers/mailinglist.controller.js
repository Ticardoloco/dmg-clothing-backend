// import { MailingList } from "../models/mailinglist.model.js";

// const subscribeToMailingList = async (req, res) => {
//     try {
//         const { email } = req.body;

//         if(!email) return res.status(400).json({message: "Email is required"});

//         const existingEmail = await MailingList.findOne({email: email.toLowerCase()});

//         if(existingEmail) {
//             return res.status(400).json({message: "Email already subscribed"});
//         }

//         const subscriber = await MailingList.create({email: email.toLowerCase()});

//         return res.status(201).json({message: "Email subscribed successfully", subscriber});
    
//     } catch (error) {
//         return res.status(500).json({message: "Internal server error", error: error.message});
//     }
// };

// const getAllSubscribers = async (req, res) => {
//     try {
//         const subscribers = await MailingList.find().sort({createdAt: -1});
//         return res.status(200).json({
//             message: "Subscribers retrieved successfully",
//             count: subscribers.length,
//             subscribers
//             });
//     } catch (error) {
//         return res.status(500).json({message: "Internal server error", error: error.message});
//     }
// };

// const deleteSubscriber = async (req, res) => {
//     try {
//         const { id } = req.params;
//          const subscriber = await MailingList.findById(id);

//          if (!subscriber) {
//             return res.status(404).json({message: "Subscriber not found"});
//          }
//          await subscriber.deleteOne();
//          return res.status(200).json({message: "Subscriber deleted successfully"}); 
//     } catch (error) {
//         return res.status(500).json({message: "Internal server error", error: error.message});
//     }
// }


// export {
//     subscribeToMailingList,
//     getAllSubscribers,
//     deleteSubscriber
// };


import { MailingList } from "../models/mailinglist.model.js";

// --- CREATE / RESUBSCRIBE TO MAILING LIST ---
const subscribeToMailingList = async (req, res) => {
    try {
        const { email, source } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const normalizedEmail = email.toLowerCase().trim();
        const existingEmail = await MailingList.findOne({ email: normalizedEmail });

        if (existingEmail) {
            // Smart Fallback: If they were unsubscribed, flip them back to active
            if (existingEmail.status === "unsubscribed") {
                existingEmail.status = "active";
                if (source) existingEmail.source = source; // Optional: Update source context
                await existingEmail.save();
                return res.status(200).json({ 
                    message: "Welcome back! Subscription reactivated successfully.", 
                    subscriber: existingEmail 
                });
            }
            return res.status(400).json({ message: "Email already subscribed" });
        }

        // Fresh signup
        const subscriber = await MailingList.create({
            email: normalizedEmail,
            source: source || "Footer Form"
        });

        return res.status(201).json({ message: "Email subscribed successfully", subscriber });
    
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// --- READ ALL SUBSCRIBERS ---
const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await MailingList.find().sort({ createdAt: -1 });
        return res.status(200).json({
            message: "Subscribers retrieved successfully",
            count: subscribers.length,
            subscribers
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// --- UPDATE SUBSCRIBER STATUS (New Dropdown Route handler) ---
const updateSubscriberStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) return res.status(400).json({ message: "Status parameter is required" });

        const normalizedStatus = status.toLowerCase().trim();
        if (!["active", "unsubscribed"].includes(normalizedStatus)) {
            return res.status(400).json({ message: "Invalid status value provided" });
        }

        const subscriber = await MailingList.findById(id);
        if (!subscriber) {
            return res.status(404).json({ message: "Subscriber record not found" });
        }

        subscriber.status = normalizedStatus;
        await subscriber.save();

        return res.status(200).json({ 
            message: `Subscriber state updated to ${normalizedStatus} successfully`, 
            subscriber 
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// --- DELETE / PURGE SUBSCRIBER RECORD ---
const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const subscriber = await MailingList.findById(id);

        if (!subscriber) {
            return res.status(404).json({ message: "Subscriber not found" });
        }
        await subscriber.deleteOne();
        return res.status(200).json({ message: "Subscriber deleted successfully" }); 
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export {
    subscribeToMailingList,
    getAllSubscribers,
    updateSubscriberStatus,
    deleteSubscriber
};


