import express from "express";  // Correct import for express
import mongoose from "mongoose"; // Mongoose for handling MongoDB

const collectionname = "address";

// Define Mongoose schema for the address collection
const addressSchema = new mongoose.Schema({
    location: {
        type: Array,
        required: true
    }
});

// Create Mongoose model for the address collection
const addressModel = mongoose.model(collectionname, addressSchema);

const router = express.Router();

// POST route for adding new address
router.post("/", async (req, res) => {
    try {
        const newAddress = new addressModel({
            location: req.body
        });
        console.log("new=",newAddress);
        const savedAddress = await newAddress.save();
        console.log("saveadd=",savedAddress);
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ message: "Error saving address", error });
    }
});


// GET route to retrieve all addresses
router.get("/", async (req, res) => {
    try {
        const addresses = await addressModel.find(); 
        res.status(200).json(addresses); 
    } catch (error) {
        res.status(500).json({ message: "Error fetching addresses", error });
    }
});

export default router; 
