import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        // Listening to connection events
        mongoose.connection.on("connected", () => {
            console.log("Connected to Database Successfully");
        });

        mongoose.connection.on("error", (error) => {
            console.log("Connection to database failed", error);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Database disconnected");
        });

        await mongoose.connect(config.DataBaseURL as string);
        
    } catch (error) {
        console.log("Failed to connect to the Database", error);
        process.exit(1);
    }
};

export default connectDB;
