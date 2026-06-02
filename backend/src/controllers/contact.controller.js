import { Contact } from "../models/contact.model.js";

const createContact = async (req, res) => {
    try {
        const { fullName, email, message } = req.body;

        if (!fullName || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const contact = await Contact.create({
            fullName,
            email,
            message
        });

        return res.status(201).json({
            message: "Contact message sent successfully",
            contact
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Contacts retrieved successfully",
            count: contacts.length,
            contacts
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        await Contact.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Contact message deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export {
    createContact,
    getAllContacts,
    deleteContact
}