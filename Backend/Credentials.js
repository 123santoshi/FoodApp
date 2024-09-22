import mongoose from "mongoose";
import express from 'express';
import nodemailer from "nodemailer";
import crypto from "crypto";
import expressAsyncHandler from 'express-async-handler'; 
import dotenv from "dotenv";
import fs from 'fs/promises';
import multer from "multer";

dotenv.config({ path: './.env' });

const router = express.Router();

const SigninSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    orders:{
        type:Array,
        default:[]
    }
    
}, { collection: "Credentials" });

// Create a Mongoose model based on the schema
const SigninModel = mongoose.model('Signin', SigninSchema);

let orderslist=[];


// Function to generate a 6-digit OTP
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
}

// Function to send an email with the OTP
const sendMail = async (email, otp) => {
    console.log("Entered into sendMail function");

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        }
    });

    transporter.verify((error, success) => {
        if (error) {
            console.log("Connection error:", error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp} .OTP Will valid only 10 minutes`,
    };

    return transporter.sendMail(mailOptions);
}

router.get("/fooddata", async (req, res) => {
    try {
        const fooddata = await import("./Rest_data.json", {
            assert: { type: "json" },
        });
        console.log("fooddata==", fooddata.default); 
        res.json(fooddata.default); 
    } catch (err) {
        console.error("Error getting the food API data ", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/fooddata/:id", async (req, res) => {
    try {
        const data = await fs.readFile('./Rest_data.json', 'utf-8');
        const fooddata = JSON.parse(data); 
        const { id } = req.params;

        if (id) {
            const fetchdata = fooddata.flatMap(restaurant => 
                restaurant.items.filter(item => item.item_id === id)
            );
            return res.json(fetchdata); 
        }

        // Send all data if no id is provided
        res.json(fooddata); 

    } catch (err) {
        console.error("Error getting the food API data based on the id:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/orderslist/:email", async (req, res) => {
    const { email } = req.params; 
    console.log("orderslist form required email ==",email);
    try {
        const existedEmail = await SigninModel.findOne({ email: email }); 
        if (existedEmail) {
            res.json({ orders: existedEmail.orders }); 
        } else {
            res.status(404).json({ message: "Email not found" }); 
        }
    } catch (err) {
        console.error("Error while retrieving the orders list:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to get all credentials
router.get("/", async (req, res) => {
    try {
        const credentials = await SigninModel.find();
        res.status(200).json(credentials);
    } catch (err) {
        console.error("Error retrieving credentials:", err);
        res.status(500).send("Internal Server Error");
    }
});

/*router.post("/orderslist", async (req, res) => {
    const data = req.body;
    console.log("data from irderslist==",data);
    try {
        if (!data) {
            return res.status(400).json({ message: "Invalid order data" });
        }
        
        orderslist.push(data);
        res.status(201).json({ message: "Order added successfully to the list" });
    } catch (err) {
        console.error("Error while adding the order to the orders list:", err);
        res.status(500).json({ error: "Error while adding the order" });
    }
});*/

router.post("/orderslist", async (req, res) => {
    const { email, orders } = req.body;
    console.log("data from orderslist==", email, orders);
    try {
        const existedEmail = await SigninModel.findOne({ email: email });
        if (existedEmail) {
            console.log("mail existed");

            // Add the order to the existing user's orders array
            existedEmail.orders = existedEmail.orders || []; // Ensure orders array exists
            existedEmail.orders.push(orders);
            await existedEmail.save(); // Save the updated user document

            res.status(201).json({ message: "Order added successfully to the list" });
        } else {
            res.status(404).json({ message: "Email not found" });
        }
    } catch (err) {
        console.error("Error while adding the order to the orders list:", err);
        res.status(500).json({ error: "Error while adding the order" });
    }
});




//signin 
router.post("/sign-in" , async (req,res)=>{
    const {email} = req.body ;
    const existedEmail = await SigninModel.findOne({ email });

    if(!existedEmail){
        res.status(404).json({message : "Email id not registered"})
    }
    else{
        res.status(200).json({message :" Email exists"})
    }

})

//to send the otp
router.post("/send-otp", expressAsyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    console.log("Generated OTP:", otp);

    try {
        const existedEmail = await SigninModel.findOne({ email });
        if (existedEmail) {
            existedEmail.otp = otp;
            existedEmail.otpExpires = otpExpires;
            await existedEmail.save();
            await sendMail(email, otp);
            res.status(200).json({ message: 'OTP sent successfully' ,otp : otp });
        } else {
            res.status(404).json({ message: "Email ID not registered" });
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
}));



router.post("/verify-otp", expressAsyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    try {
        const user = await SigninModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email ID not registered" });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.otpExpires < new Date()) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    }
}));

// Route to create a new email entry
router.post("/", expressAsyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const existedEmail = await SigninModel.findOne({ email });
        if (existedEmail) {
            res.status(409).json({ message: "Email ID already exists" });
        } else {
            await SigninModel.create({ email });
            res.status(201).json({ message: "Email ID created successfully" });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}));






export default router;
