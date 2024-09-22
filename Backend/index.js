import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Credentials from './Credentials.js'; 
import Address from "./Address.js";

const app = express();

app.use(cors());
app.use(express.json());

const connection_string = "mongodb://localhost:27017/FoodDB";

mongoose.connect(connection_string, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
        app.listen(4000, () => {
            console.log("Server is running on port 1000");
        });
    })
    .catch(err => console.log("Error while connecting to MongoDB:", err));

app.get("/", (req, res) => {
    console.log("GET / root route accessed");
    res.send("Welcome to the root route");
});

app.use("/credentials", Credentials);
app.use("/address",Address);

// Corrected POST route path
app.post("/credentials/send-otp", Credentials);

export default app;
