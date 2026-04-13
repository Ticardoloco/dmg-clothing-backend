import mongoose from "mongoose";

const connectDB = async () =>{
   try {
     const instanceConnect = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`\n mongoDb connected!!!
        ${instanceConnect.connection.host}`);
        
   } catch (error) {
    console.log("mongoDb connection failed!", error);
    process.exit(1);
   }
    
}

export default connectDB;