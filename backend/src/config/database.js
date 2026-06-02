// import mongoose from "mongoose";

// const connectDB = async () =>{
//    try {
//      const instanceConnect = await mongoose.connect(`${process.env.MONGODB_URI}`);
//     console.log(`\n mongoDb connected!!!
//         ${instanceConnect.connection.host}`);
        
//    } catch (error) {
//     console.log("mongoDb connection failed!", error);
//     process.exit(1);
//    }
    
// }

// export default connectDB;

import mongoose from "mongoose";

// A global object used to cache the connection across hot-reloads in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
   try {
     // 1. If we already have an active connection, reuse it immediately
     if (cached.conn) {
       return cached.conn;
     }

     // 2. If no connection promise exists, create a new one
     if (!cached.promise) {
       const opts = {
         bufferCommands: false,
       };

       console.log("Creating new MongoDB connection pool...");
       cached.promise = mongoose.connect(`${process.env.MONGODB_URI}`, opts).then((mongooseInstance) => {
         return mongooseInstance;
       });
     }
     
     // 3. Await the pending connection promise
     cached.conn = await cached.promise;
     
     console.log(`\n MongoDB connected successfully!!! Host: ${cached.conn.connection.host}`);
     return cached.conn;
        
   } catch (error) {
     console.log("MongoDB connection failed!", error);
     // In Next.js serverless functions, do NOT use process.exit(1). 
     // Let the error throw naturally so Next.js can handle the request life cycle.
     throw error; 
   }
}

export default connectDB;