import "dotenv/config";
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const { DB_ROOT_USER, DB_ROOT_PASSWORD, DB_HOST, DB_PORT, DB_NAME } =
            process.env;

        const DB_URL = `mongodb://${DB_ROOT_USER}:${DB_ROOT_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
        await mongoose.connect(DB_URL);
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting with MONGO DB ", err);
        process.exit(1); //exit with failure
    }
};
