import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";
import serverless from "serverless-http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// Connect DB (only once per cold start)
let isConnected = false;

const startServer = async () => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
      console.log("MongoDB connected");
    }
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

// Initialize DB connection
startServer();

const handler = serverless(app);

// Export serverless handler for Vercel and other serverless environments
export default handler;