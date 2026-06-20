import express from "express";
import appRouter from "./routes.js";
import { connectDB } from "./config/dbConfig.js";

const runServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 8000;

    await connectDB();
    app.use(express.json());
    app.use("/api", appRouter);
    app.get("/", (req, res) => res.json({ message: "Server is running okay" }));
    app.listen(PORT, () => {
        console.log(`Server started on Port http://localhost:${PORT}`);
    });
};
export default runServer;
