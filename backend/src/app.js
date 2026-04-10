import express from "express";

const app = express()

app.use(express.json());
// import routes 
import userRouter from "./routes/user.route.js"

app.use("/api/v1/user", userRouter);

export default app;


// api url: http://localhost:4001/api/v1/user