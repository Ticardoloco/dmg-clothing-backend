import express from "express";
import cors from "cors";

const app = express()

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
// import routes 
import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js";


app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRouter);

export default app;


// api url: http://localhost:4001/api/v1/user