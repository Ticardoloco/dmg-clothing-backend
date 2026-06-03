import express from "express";
import cors from "cors";
import serverless from "serverless-http";

const app = express()

app.use(cors({
  origin: ["http://localhost:3000", "https://dmg-clothing.vercel.app"],
  methods: ["GET", "POST", "PUT", 'PATCH', 'DELETE'],
  credentials: true
}));


app.use(express.json());
// import routes 
import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js";
import orderRouter from "./routes/order.route.js";
import contactRouter from "./routes/contact.route.js";
import mailingListRouter from "./routes/mailinglist.route.js";
import adminRouter from "./routes/admin.route.js";


app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/mailinglist", mailingListRouter);
app.use("/api/v1/admin", adminRouter);


export default serverless(app);


// api url: http://localhost:4001/api/v1/user